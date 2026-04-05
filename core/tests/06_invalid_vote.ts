import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import { Solarium } from "../target/types/solarium";
import {
  TASK_TYPE_ANALYZE,
  TIER_HEAVY,
  VERDICT_APPROVED,
  VOTE_INVALID,
  WORKER_CONFIDENCE,
  TASK_REWARD,
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

describe("06 - Invalid Vote (Adversarial Prompt Protection)", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Solarium as Program<Solarium>;
  const connection = provider.connection;

  let TASK_ID: BN;
  let taskPda: PublicKey;
  let workerSalt: Buffer;
  let val1Salt: Buffer;
  let val2Salt: Buffer;
  let workerBalBefore: number;

  before(async () => {
    await airdropSol(connection, ALICE_KEYPAIR);
    const [protocolPda] = deriveProtocolPda(program.programId);
    const protocol = await program.account.protocolState.fetch(protocolPda);
    TASK_ID = protocol.taskCounter as BN;
    [taskPda] = deriveTaskPda(TASK_ID, program.programId);
  });

  it("creates and claims task for invalid vote test", async () => {
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

  it("worker commits normally, both validators commit INVALID", async () => {
    workerSalt = generateSalt();
    const wHash = workerCommitment(VERDICT_APPROVED, WORKER_CONFIDENCE, workerSalt);
    await program.methods
      .commitResult(wHash, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: WORKER_KEYPAIR.publicKey, task: taskPda })
      .signers([WORKER_KEYPAIR])
      .rpc();

    val1Salt = generateSalt();
    const v1Hash = validatorCommitment(VOTE_INVALID, val1Salt);
    await program.methods
      .commitResult(v1Hash, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: VALIDATOR1_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR1_KEYPAIR])
      .rpc();

    val2Salt = generateSalt();
    const v2Hash = validatorCommitment(VOTE_INVALID, val2Salt);
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
      .revealResult(VOTE_INVALID, 0, Array.from(val1Salt))
      .accounts({ operator: VALIDATOR1_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR1_KEYPAIR])
      .rpc();

    await program.methods
      .revealResult(VOTE_INVALID, 0, Array.from(val2Salt))
      .accounts({ operator: VALIDATOR2_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR2_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(task.revealsReceived).to.equal(3);
  });

  it("finalize resolves as invalidated", async () => {
    const [workerNodePda] = deriveNodePda(WORKER_KEYPAIR.publicKey, program.programId);
    workerBalBefore = (await program.account.nodeState.fetch(workerNodePda)).pendingRewards.toNumber();

    const [workerCommitPda] = deriveCommitPda(taskPda, WORKER_KEYPAIR.publicKey, program.programId);
    const [v1NodePda] = deriveNodePda(VALIDATOR1_KEYPAIR.publicKey, program.programId);
    const [v1CommitPda] = deriveCommitPda(taskPda, VALIDATOR1_KEYPAIR.publicKey, program.programId);
    const [v2NodePda] = deriveNodePda(VALIDATOR2_KEYPAIR.publicKey, program.programId);
    const [v2CommitPda] = deriveCommitPda(taskPda, VALIDATOR2_KEYPAIR.publicKey, program.programId);

    await program.methods
      .finalizeTask()
      .accountsPartial({
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
    expect(JSON.stringify(task.status)).to.include("invalidated");
  });

  it("worker received compensation from confiscated deposit", async () => {
    const [workerNodePda] = deriveNodePda(WORKER_KEYPAIR.publicKey, program.programId);
    const node = await program.account.nodeState.fetch(workerNodePda);
    expect(node.pendingRewards.toNumber()).to.be.greaterThan(workerBalBefore);
  });

  it("invalid-voting validators received rewards", async () => {
    const [v1Pda] = deriveNodePda(VALIDATOR1_KEYPAIR.publicKey, program.programId);
    const v1 = await program.account.nodeState.fetch(v1Pda);
    expect(v1.tasksCompleted).to.be.greaterThan(0);

    const [v2Pda] = deriveNodePda(VALIDATOR2_KEYPAIR.publicKey, program.programId);
    const v2 = await program.account.nodeState.fetch(v2Pda);
    expect(v2.tasksCompleted).to.be.greaterThan(0);
  });
});
