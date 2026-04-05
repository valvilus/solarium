import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import { Solarium } from "../target/types/solarium";
import {
  WORKER_TYPE,
  TASK_TYPE_ANALYZE,
  TIER_HEAVY,
  VERDICT_APPROVED,
  VOTE_AGREE,
  WORKER_CONFIDENCE,
  TASK_REWARD,
  EMPTY_HASH,
  VALIDATOR_COUNT,
  ALICE_KEYPAIR,
  WORKER_KEYPAIR,
  VALIDATOR1_KEYPAIR,
  VALIDATOR2_KEYPAIR,
  deriveTaskPda,
  createFundedKeypair,
  generateSalt,
  workerCommitment,
  validatorCommitment,
} from "./helpers";

describe("03 - Error Paths", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Solarium as Program<Solarium>;
  const connection = provider.connection;

  const TASK_1 = new BN(1);
  const TASK_2 = new BN(2);
  const TASK_3 = new BN(3);
  let task1Pda: PublicKey;
  let task2Pda: PublicKey;
  let task3Pda: PublicKey;

  before(async () => {
    [task1Pda] = deriveTaskPda(TASK_1, program.programId);
    [task2Pda] = deriveTaskPda(TASK_2, program.programId);
    [task3Pda] = deriveTaskPda(TASK_3, program.programId);
  });

  it("cannot register same wallet twice", async () => {
    try {
      await program.methods
        .registerNode(WORKER_TYPE, TIER_HEAVY)
        .accounts({ operator: WORKER_KEYPAIR.publicKey })
        .signers([WORKER_KEYPAIR])
        .rpc();
      expect.fail("expected error");
    } catch (e) {
      expect(e).to.exist;
    }
  });

  it("validator cannot claim a task", async () => {
    await program.methods
      .createTask(TASK_1, EMPTY_HASH, TASK_TYPE_ANALYZE, TIER_HEAVY, TASK_REWARD, VALIDATOR_COUNT)
      .accounts({ creator: ALICE_KEYPAIR.publicKey })
      .signers([ALICE_KEYPAIR])
      .rpc();

    try {
      await program.methods
        .claimTask()
        .accounts({ operator: VALIDATOR1_KEYPAIR.publicKey, task: task1Pda })
        .signers([VALIDATOR1_KEYPAIR])
        .rpc();
      expect.fail("expected WorkerOnly");
    } catch (e) {
      expect(String(e)).to.include("WorkerOnly");
    }
  });

  it("cancels open task with refund", async () => {
    const balBefore = await connection.getBalance(ALICE_KEYPAIR.publicKey);

    await program.methods
      .cancelTask()
      .accounts({ creator: ALICE_KEYPAIR.publicKey, task: task1Pda })
      .signers([ALICE_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(task1Pda);
    expect(JSON.stringify(task.status)).to.include("cancelled");

    const balAfter = await connection.getBalance(ALICE_KEYPAIR.publicKey);
    expect(balAfter).to.be.greaterThan(balBefore);
  });

  it("cannot cancel completed task", async () => {
    const [task0Pda] = deriveTaskPda(new BN(0), program.programId);
    try {
      await program.methods
        .cancelTask()
        .accounts({ creator: ALICE_KEYPAIR.publicKey, task: task0Pda })
        .signers([ALICE_KEYPAIR])
        .rpc();
      expect.fail("expected TaskNotOpen");
    } catch (e) {
      expect(String(e)).to.include("TaskNotOpen");
    }
  });

  it("unauthorized wallet cannot cancel task", async () => {
    await program.methods
      .createTask(TASK_2, EMPTY_HASH, TASK_TYPE_ANALYZE, TIER_HEAVY, TASK_REWARD, VALIDATOR_COUNT)
      .accounts({ creator: ALICE_KEYPAIR.publicKey })
      .signers([ALICE_KEYPAIR])
      .rpc();

    const bob = await createFundedKeypair(connection);
    try {
      await program.methods.cancelTask().accounts({ creator: bob.publicKey, task: task2Pda }).signers([bob]).rpc();
      expect.fail("expected Unauthorized");
    } catch (e) {
      expect(e).to.exist;
    }
  });

  it("validator cannot commit before worker", async () => {
    await program.methods
      .createTask(TASK_3, EMPTY_HASH, TASK_TYPE_ANALYZE, TIER_HEAVY, TASK_REWARD, VALIDATOR_COUNT)
      .accounts({ creator: ALICE_KEYPAIR.publicKey })
      .signers([ALICE_KEYPAIR])
      .rpc();

    await program.methods
      .claimTask()
      .accounts({ operator: WORKER_KEYPAIR.publicKey, task: task3Pda })
      .signers([WORKER_KEYPAIR])
      .rpc();

    const hash = validatorCommitment(VOTE_AGREE, generateSalt());
    try {
      await program.methods
        .commitResult(hash, EMPTY_HASH, EMPTY_HASH)
        .accounts({ operator: VALIDATOR1_KEYPAIR.publicKey, task: task3Pda })
        .signers([VALIDATOR1_KEYPAIR])
        .rpc();
      expect.fail("expected WorkerNotCommitted");
    } catch (e) {
      expect(String(e)).to.include("WorkerNotCommitted");
    }
  });

  it("all three commit to task 3", async () => {
    const wHash = workerCommitment(VERDICT_APPROVED, WORKER_CONFIDENCE, generateSalt());
    await program.methods
      .commitResult(wHash, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: WORKER_KEYPAIR.publicKey, task: task3Pda })
      .signers([WORKER_KEYPAIR])
      .rpc();

    const v1Hash = validatorCommitment(VOTE_AGREE, generateSalt());
    await program.methods
      .commitResult(v1Hash, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: VALIDATOR1_KEYPAIR.publicKey, task: task3Pda })
      .signers([VALIDATOR1_KEYPAIR])
      .rpc();

    const v2Hash = validatorCommitment(VOTE_AGREE, generateSalt());
    await program.methods
      .commitResult(v2Hash, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: VALIDATOR2_KEYPAIR.publicKey, task: task3Pda })
      .signers([VALIDATOR2_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(task3Pda);
    expect(JSON.stringify(task.status)).to.include("revealing");
  });

  it("cannot reveal with wrong salt", async () => {
    const wrongSalt = generateSalt();
    try {
      await program.methods
        .revealResult(VERDICT_APPROVED, WORKER_CONFIDENCE, Array.from(wrongSalt))
        .accounts({ operator: WORKER_KEYPAIR.publicKey, task: task3Pda })
        .signers([WORKER_KEYPAIR])
        .rpc();
      expect.fail("expected InvalidReveal");
    } catch (e) {
      expect(String(e)).to.include("InvalidReveal");
    }
  });
});
