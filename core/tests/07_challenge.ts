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
  VALIDATOR_COUNT,
  EMPTY_HASH,
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

describe("07 - Challenge Layer", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Solarium as Program<Solarium>;
  const connection = provider.connection;

  let TASK_ID: BN;
  let taskPda: PublicKey;
  let workerSalt: Buffer;
  let val1Salt: Buffer;
  let val2Salt: Buffer;
  const CHALLENGER_KEYPAIR = anchor.web3.Keypair.generate();

  before(async () => {
    await airdropSol(connection, ALICE_KEYPAIR);
    await airdropSol(connection, CHALLENGER_KEYPAIR);

    const [protocolPda] = deriveProtocolPda(program.programId);
    const protocol = await program.account.protocolState.fetch(protocolPda);
    TASK_ID = protocol.taskCounter as BN;
    [taskPda] = deriveTaskPda(TASK_ID, program.programId);
  });

  it("creates, claims, commits, reveals and optimistic finalizes a task", async () => {
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

    workerSalt = generateSalt();
    let commitment = workerCommitment(VERDICT_APPROVED, WORKER_CONFIDENCE, workerSalt);
    await program.methods
      .commitResult(commitment, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: WORKER_KEYPAIR.publicKey, task: taskPda })
      .signers([WORKER_KEYPAIR])
      .rpc();

    val1Salt = generateSalt();
    commitment = validatorCommitment(VOTE_AGREE, val1Salt);
    await program.methods
      .commitResult(commitment, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: VALIDATOR1_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR1_KEYPAIR])
      .rpc();

    val2Salt = generateSalt();
    commitment = validatorCommitment(VOTE_AGREE, val2Salt);
    await program.methods
      .commitResult(commitment, EMPTY_HASH, EMPTY_HASH)
      .accounts({ operator: VALIDATOR2_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR2_KEYPAIR])
      .rpc();

    await program.methods
      .revealResult(VERDICT_APPROVED, WORKER_CONFIDENCE, Array.from(workerSalt))
      .accounts({ operator: WORKER_KEYPAIR.publicKey, task: taskPda })
      .signers([WORKER_KEYPAIR])
      .rpc();

    await program.methods
      .revealResult(VOTE_AGREE, 0, Array.from(val1Salt))
      .accounts({ operator: VALIDATOR1_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR1_KEYPAIR])
      .rpc();

    await program.methods
      .revealResult(VOTE_AGREE, 0, Array.from(val2Salt))
      .accounts({ operator: VALIDATOR2_KEYPAIR.publicKey, task: taskPda })
      .signers([VALIDATOR2_KEYPAIR])
      .rpc();

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
  });

  it("challenges the task with a bond", async () => {
    const taskBefore = await connection.getBalance(taskPda);

    await program.methods
      .challengeTask()
      .accountsPartial({
        challenger: CHALLENGER_KEYPAIR.publicKey,
        task: taskPda,
      })
      .signers([CHALLENGER_KEYPAIR])
      .rpc();

    const taskAfter = await connection.getBalance(taskPda);

    expect(taskAfter).to.be.greaterThan(taskBefore);

    const task = await program.account.taskState.fetch(taskPda);
    expect(JSON.stringify(task.status)).to.include("challenged");
  });
});
