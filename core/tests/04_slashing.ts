import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import { Solarium } from "../target/types/solarium";
import {
  TASK_TYPE_ANALYZE,
  TIER_HEAVY,
  VERDICT_APPROVED,
  VOTE_DISAGREE,
  WORKER_CONFIDENCE,
  TASK_REWARD,
  TASK_REWARD_LAMPORTS,
  VALIDATOR_REWARD_BPS,
  BPS_DENOMINATOR,
  SLASH_WRONG_VERDICT_BPS,
  EMPTY_HASH,
  VALIDATOR_COUNT,
  ALICE_KEYPAIR,
  WORKER_KEYPAIR,
  VALIDATOR1_KEYPAIR,
  VALIDATOR2_KEYPAIR,
  TREASURY_KEYPAIR,
  deriveProtocolPda,
  deriveNodePda,
  deriveTaskPda,
  deriveCommitPda,
  airdropSol,
  generateSalt,
  workerCommitment,
  validatorCommitment,
} from "./helpers";

describe("04 - Slashing (Disputed Consensus)", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Solarium as Program<Solarium>;
  const connection = provider.connection;

  const TASK_ID = new BN(4);
  let taskPda: PublicKey;
  let workerSalt: Buffer;
  let val1Salt: Buffer;
  let val2Salt: Buffer;
  let aliceBalBefore: number;

  before(async () => {
    await airdropSol(connection, ALICE_KEYPAIR);
    [taskPda] = deriveTaskPda(TASK_ID, program.programId);
  });

  it("creates and claims disputed task", async () => {
    await program.methods
      .createTask(TASK_ID, EMPTY_HASH, TASK_TYPE_ANALYZE, TIER_HEAVY, TASK_REWARD, VALIDATOR_COUNT)
      .accounts({ creator: ALICE_KEYPAIR.publicKey })
      .signers([ALICE_KEYPAIR])
      .rpc();

    await program.methods
      .claimTask()
      .accounts({ operator: WORKER_KEYPAIR.publicKey, task: taskPda })
      .signers([WORKER_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(JSON.stringify(task.status)).to.include("claimed");
  });

  it("all commit with mixed verdicts", async () => {
    workerSalt = generateSalt();
    const wHash = workerCommitment(VERDICT_APPROVED, WORKER_CONFIDENCE, workerSalt);
    await program.methods
      .commitResult(wHash, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: WORKER_KEYPAIR.publicKey, task: taskPda })
      .signers([WORKER_KEYPAIR])
      .rpc();

    val1Salt = generateSalt();
    const v1Hash = validatorCommitment(VOTE_DISAGREE, val1Salt);
    await program.methods
      .commitResult(v1Hash, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: VALIDATOR1_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR1_KEYPAIR])
      .rpc();

    val2Salt = generateSalt();
    const v2Hash = validatorCommitment(VOTE_DISAGREE, val2Salt);
    await program.methods
      .commitResult(v2Hash, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: VALIDATOR2_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR2_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(JSON.stringify(task.status)).to.include("revealing");
  });

  it("all reveal their verdicts", async () => {
    await program.methods
      .revealResult(VERDICT_APPROVED, WORKER_CONFIDENCE, Array.from(workerSalt))
      .accounts({ operator: WORKER_KEYPAIR.publicKey, task: taskPda })
      .signers([WORKER_KEYPAIR])
      .rpc();

    await program.methods
      .revealResult(VOTE_DISAGREE, 0, Array.from(val1Salt))
      .accounts({ operator: VALIDATOR1_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR1_KEYPAIR])
      .rpc();

    await program.methods
      .revealResult(VOTE_DISAGREE, 0, Array.from(val2Salt))
      .accounts({ operator: VALIDATOR2_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR2_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(task.revealsReceived).to.equal(3);
  });

  it("finalize resolves as dispute", async () => {
    aliceBalBefore = await connection.getBalance(ALICE_KEYPAIR.publicKey);

    const [workerNodePda] = deriveNodePda(WORKER_KEYPAIR.publicKey, program.programId);
    const [workerCommitPda] = deriveCommitPda(taskPda, WORKER_KEYPAIR.publicKey, program.programId);
    const [v1NodePda] = deriveNodePda(VALIDATOR1_KEYPAIR.publicKey, program.programId);
    const [v1CommitPda] = deriveCommitPda(taskPda, VALIDATOR1_KEYPAIR.publicKey, program.programId);
    const [v2NodePda] = deriveNodePda(VALIDATOR2_KEYPAIR.publicKey, program.programId);
    const [v2CommitPda] = deriveCommitPda(taskPda, VALIDATOR2_KEYPAIR.publicKey, program.programId);

    await program.methods
      .finalizeTask()
      .accounts({
        caller: ALICE_KEYPAIR.publicKey,
        task: taskPda,
        workerNode: workerNodePda,
        workerCommit: workerCommitPda,
        creator: ALICE_KEYPAIR.publicKey,
        treasury: TREASURY_KEYPAIR.publicKey,
      })
      .remainingAccounts([
        { pubkey: v1NodePda, isSigner: false, isWritable: true },
        { pubkey: v1CommitPda, isSigner: false, isWritable: false },
        { pubkey: v2NodePda, isSigner: false, isWritable: true },
        { pubkey: v2CommitPda, isSigner: false, isWritable: false },
      ])
      .signers([ALICE_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(JSON.stringify(task.status)).to.include("disputed");
  });

  it("worker is slashed and penalized", async () => {
    const [workerNodePda] = deriveNodePda(WORKER_KEYPAIR.publicKey, program.programId);
    const node = await program.account.nodeState.fetch(workerNodePda);

    const expectedSlash = Math.floor((1_000_000_000 * SLASH_WRONG_VERDICT_BPS) / BPS_DENOMINATOR);
    expect(node.stake.toNumber()).to.equal(1_000_000_000 - expectedSlash);
    expect(node.reputation).to.equal(4_850);
    expect(node.tasksFailed).to.equal(1);
  });

  it("disagreeing validators received rewards", async () => {
    const valPool = Math.floor((TASK_REWARD_LAMPORTS * VALIDATOR_REWARD_BPS) / BPS_DENOMINATOR);
    const perVal = Math.floor(valPool / VALIDATOR_COUNT);

    const [v1Pda] = deriveNodePda(VALIDATOR1_KEYPAIR.publicKey, program.programId);
    const v1 = await program.account.nodeState.fetch(v1Pda);
    const expectedV1Rewards = 9_500_000 + perVal;
    expect(v1.pendingRewards.toNumber()).to.equal(expectedV1Rewards);
    expect(v1.reputation).to.equal(5_100);
    expect(v1.tasksCompleted).to.equal(2);

    const [v2Pda] = deriveNodePda(VALIDATOR2_KEYPAIR.publicKey, program.programId);
    const v2 = await program.account.nodeState.fetch(v2Pda);
    expect(v2.pendingRewards.toNumber()).to.equal(expectedV1Rewards);
    expect(v2.tasksCompleted).to.equal(2);
  });

  it("creator received partial refund", async () => {
    const valPool = Math.floor((TASK_REWARD_LAMPORTS * VALIDATOR_REWARD_BPS) / BPS_DENOMINATOR);
    const expectedRefund = TASK_REWARD_LAMPORTS - valPool;
    const aliceBalAfter = await connection.getBalance(ALICE_KEYPAIR.publicKey);
    const diff = aliceBalAfter - aliceBalBefore;
    expect(diff).to.be.closeTo(expectedRefund, 10_000);
  });
});
