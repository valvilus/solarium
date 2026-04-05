import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import { Solarium } from "../target/types/solarium";
import {
  TASK_TYPE_ANALYZE,
  TIER_HEAVY,
  TASK_REWARD,
  VALIDATOR_COUNT,
  EMPTY_HASH,
  ALICE_KEYPAIR,
  WORKER_KEYPAIR,
  deriveProtocolPda,
  deriveNodePda,
  deriveTaskPda,
  airdropSol,
} from "./helpers";

describe("05 - Timeout Task (Garbage Collection)", function () {
  this.timeout(150000);

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Solarium as Program<Solarium>;
  const connection = provider.connection;

  let TASK_ID: BN;
  let taskPda: PublicKey;
  let aliceBalBefore: number;
  let workerNodePda: PublicKey;

  before(async () => {
    await airdropSol(connection, ALICE_KEYPAIR);
    const [protocolPda] = deriveProtocolPda(program.programId);
    const protocol = await program.account.protocolState.fetch(protocolPda);
    TASK_ID = protocol.taskCounter as BN;
    [taskPda] = deriveTaskPda(TASK_ID, program.programId);
    [workerNodePda] = deriveNodePda(WORKER_KEYPAIR.publicKey, program.programId);
  });

  it("creates and claims a task", async () => {
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

    aliceBalBefore = await connection.getBalance(ALICE_KEYPAIR.publicKey);

    const task = await program.account.taskState.fetch(taskPda);
    expect(JSON.stringify(task.status)).to.include("claimed");
  });

  it("fails to timeout before deadline", async () => {
    try {
      await program.methods
        .timeoutTask()
        .accountsPartial({
          caller: ALICE_KEYPAIR.publicKey,
          task: taskPda,
          workerNode: workerNodePda,
          creator: ALICE_KEYPAIR.publicKey,
        })
        .signers([ALICE_KEYPAIR])
        .rpc();
      expect.fail("Expected DeadlineNotPassed error");
    } catch (e) {
      expect(String(e)).to.include("DeadlineNotPassed");
    }
  });

  it("waits for deadline and successfully timeouts task, slashing worker", async () => {
    console.log("    Waiting 61 seconds for commit_deadline to pass...");
    await new Promise((resolve) => setTimeout(resolve, 61000));

    const nodeBefore = await program.account.nodeState.fetch(workerNodePda);
    const workerStakeBefore = nodeBefore.stake.toNumber();

    await program.methods
      .timeoutTask()
      .accountsPartial({
        caller: ALICE_KEYPAIR.publicKey,
        task: taskPda,
        workerNode: workerNodePda,
        creator: ALICE_KEYPAIR.publicKey,
      })
      .signers([ALICE_KEYPAIR])
      .rpc();

    const task = await program.account.taskState.fetch(taskPda);
    expect(JSON.stringify(task.status)).to.include("cancelled");

    const aliceBalAfter = await connection.getBalance(ALICE_KEYPAIR.publicKey);
    expect(aliceBalAfter).to.be.greaterThan(aliceBalBefore);

    const nodeAfter = await program.account.nodeState.fetch(workerNodePda);
    expect(nodeAfter.stake.toNumber()).to.be.lessThan(workerStakeBefore);
    expect(nodeAfter.tasksFailed).to.be.greaterThan(nodeBefore.tasksFailed);
  });
});
