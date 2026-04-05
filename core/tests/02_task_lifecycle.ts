import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import { Solarium } from "../target/types/solarium";
import {
  TASK_TYPE_ANALYZE,
  TIER_HEAVY,
  VERDICT_APPROVED,
  VOTE_AGREE,
  WORKER_CONFIDENCE,
  TASK_REWARD,
  TASK_REWARD_LAMPORTS,
  PROTOCOL_FEE_BPS,
  WORKER_REWARD_BPS,
  VALIDATOR_REWARD_BPS,
  BPS_DENOMINATOR,
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

describe("02 - Task Lifecycle (Happy Path)", function () {
  this.timeout(400000);

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Solarium as Program<Solarium>;
  const connection = provider.connection;

  const TASK_ID = new BN(0);
  let taskPda: PublicKey;
  let workerSalt: Buffer;
  let val1Salt: Buffer;
  let val2Salt: Buffer;

  before(async () => {
    await airdropSol(connection, ALICE_KEYPAIR);
    [taskPda] = deriveTaskPda(TASK_ID, program.programId);
  });

  it("creates a task", async () => {
    await program.methods
      .createTask(TASK_ID, EMPTY_HASH, TASK_TYPE_ANALYZE, TIER_HEAVY, TASK_REWARD, VALIDATOR_COUNT)
      .accounts({ creator: ALICE_KEYPAIR.publicKey })
      .signers([ALICE_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(task.taskId.toNumber()).to.equal(0);
    expect(task.creator.toBase58()).to.equal(ALICE_KEYPAIR.publicKey.toBase58());
    expect(task.reward.toNumber()).to.equal(TASK_REWARD_LAMPORTS);
    expect(task.validatorCount).to.equal(VALIDATOR_COUNT);
    expect(JSON.stringify(task.status)).to.include("open");
  });

  it("worker claims the task", async () => {
    await program.methods
      .claimTask()
      .accounts({ operator: WORKER_KEYPAIR.publicKey, task: taskPda })
      .signers([WORKER_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(JSON.stringify(task.status)).to.include("claimed");
    expect(task.assignedWorker.toBase58()).to.equal(WORKER_KEYPAIR.publicKey.toBase58());
    expect(task.commitDeadline.toNumber()).to.be.greaterThan(0);
  });

  it("worker commits result", async () => {
    workerSalt = generateSalt();
    const commitment = workerCommitment(VERDICT_APPROVED, WORKER_CONFIDENCE, workerSalt);

    await program.methods
      .commitResult(commitment, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: WORKER_KEYPAIR.publicKey, task: taskPda })
      .signers([WORKER_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(JSON.stringify(task.status)).to.include("committed");
    expect(task.commitsReceived).to.equal(1);
  });

  it("validator 1 commits", async () => {
    val1Salt = generateSalt();
    const commitment = validatorCommitment(VOTE_AGREE, val1Salt);

    await program.methods
      .commitResult(commitment, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: VALIDATOR1_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR1_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(task.commitsReceived).to.equal(2);
  });

  it("validator 2 commits - triggers revealing", async () => {
    val2Salt = generateSalt();
    const commitment = validatorCommitment(VOTE_AGREE, val2Salt);

    await program.methods
      .commitResult(commitment, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: VALIDATOR2_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR2_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(task.commitsReceived).to.equal(3);
    expect(JSON.stringify(task.status)).to.include("revealing");
    expect(task.revealDeadline.toNumber()).to.be.greaterThan(0);
  });

  it("worker reveals verdict", async () => {
    await program.methods
      .revealResult(VERDICT_APPROVED, WORKER_CONFIDENCE, Array.from(workerSalt))
      .accounts({ operator: WORKER_KEYPAIR.publicKey, task: taskPda })
      .signers([WORKER_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(task.revealsReceived).to.equal(1);
  });

  it("validator 1 reveals agree", async () => {
    await program.methods
      .revealResult(VOTE_AGREE, 0, Array.from(val1Salt))
      .accounts({ operator: VALIDATOR1_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR1_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(task.revealsReceived).to.equal(2);
  });

  it("validator 2 reveals agree", async () => {
    await program.methods
      .revealResult(VOTE_AGREE, 0, Array.from(val2Salt))
      .accounts({ operator: VALIDATOR2_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR2_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(task.revealsReceived).to.equal(3);
  });

  it("finalizes task with consensus", async () => {
    const treasuryBalBefore = await connection.getBalance(TREASURY_KEYPAIR.publicKey);
    const [workerNodePda] = deriveNodePda(WORKER_KEYPAIR.publicKey, program.programId);
    const [workerCommitPda] = deriveCommitPda(taskPda, WORKER_KEYPAIR.publicKey, program.programId);
    const [val1NodePda] = deriveNodePda(VALIDATOR1_KEYPAIR.publicKey, program.programId);
    const [val1CommitPda] = deriveCommitPda(taskPda, VALIDATOR1_KEYPAIR.publicKey, program.programId);
    const [val2NodePda] = deriveNodePda(VALIDATOR2_KEYPAIR.publicKey, program.programId);
    const [val2CommitPda] = deriveCommitPda(taskPda, VALIDATOR2_KEYPAIR.publicKey, program.programId);

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
        { pubkey: val1NodePda, isSigner: false, isWritable: true },
        { pubkey: val1CommitPda, isSigner: false, isWritable: false },
        { pubkey: val2NodePda, isSigner: false, isWritable: true },
        { pubkey: val2CommitPda, isSigner: false, isWritable: false },
      ])
      .signers([ALICE_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(JSON.stringify(task.status)).to.include("optimisticFinalized");
    expect(JSON.stringify(task.finalVerdict)).to.include("approved");
    expect(task.optimisticFinalityTimestamp.toNumber()).to.be.greaterThan(0);
  });

  it("resolves optimistic task after challenge window", async () => {
    console.log("    Waiting 301 seconds for challenge window to pass... (go grab coffee)");
    await new Promise((resolve) => setTimeout(resolve, 301000));

    const treasuryBalBefore = await connection.getBalance(TREASURY_KEYPAIR.publicKey);
    const [workerNodePda] = deriveNodePda(WORKER_KEYPAIR.publicKey, program.programId);
    const [workerCommitPda] = deriveCommitPda(taskPda, WORKER_KEYPAIR.publicKey, program.programId);
    const [val1NodePda] = deriveNodePda(VALIDATOR1_KEYPAIR.publicKey, program.programId);
    const [val1CommitPda] = deriveCommitPda(taskPda, VALIDATOR1_KEYPAIR.publicKey, program.programId);
    const [val2NodePda] = deriveNodePda(VALIDATOR2_KEYPAIR.publicKey, program.programId);
    const [val2CommitPda] = deriveCommitPda(taskPda, VALIDATOR2_KEYPAIR.publicKey, program.programId);

    await program.methods
      .resolveOptimisticTask()
      .accountsPartial({
        caller: ALICE_KEYPAIR.publicKey,
        task: taskPda,
        workerNode: workerNodePda,
        workerCommit: workerCommitPda,
        creator: ALICE_KEYPAIR.publicKey,
        treasury: TREASURY_KEYPAIR.publicKey,
      })
      .remainingAccounts([
        { pubkey: val1NodePda, isSigner: false, isWritable: true },
        { pubkey: val1CommitPda, isSigner: false, isWritable: false },
        { pubkey: val2NodePda, isSigner: false, isWritable: true },
        { pubkey: val2CommitPda, isSigner: false, isWritable: false },
      ])
      .signers([ALICE_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(JSON.stringify(task.status)).to.include("finalized");

    const expectedFee = Math.floor((TASK_REWARD_LAMPORTS * PROTOCOL_FEE_BPS) / BPS_DENOMINATOR);
    const net = TASK_REWARD_LAMPORTS - expectedFee;
    const expectedWorkerReward = Math.floor((net * WORKER_REWARD_BPS) / BPS_DENOMINATOR);
    const validatorPool = Math.floor((net * VALIDATOR_REWARD_BPS) / BPS_DENOMINATOR);
    const expectedPerValidator = Math.floor(validatorPool / VALIDATOR_COUNT);

    const workerNode = await program.account.nodeState.fetch(workerNodePda);
    expect(workerNode.pendingRewards.toNumber()).to.equal(expectedWorkerReward);
    expect(workerNode.tasksCompleted).to.equal(1);
    expect(workerNode.reputation).to.equal(5_050);

    const treasuryBalAfter = await connection.getBalance(TREASURY_KEYPAIR.publicKey);
    expect(treasuryBalAfter - treasuryBalBefore).to.equal(expectedFee);

    const [protocolPda] = deriveProtocolPda(program.programId);
    const protocol = await program.account.protocolState.fetch(protocolPda);
    expect(protocol.totalTasksCompleted.toNumber()).to.equal(1);
  });
});
