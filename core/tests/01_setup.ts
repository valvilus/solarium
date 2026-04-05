import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { Solarium } from "../target/types/solarium";
import {
  WORKER_TYPE,
  VALIDATOR_TYPE,
  TIER_HEAVY,
  TIER_LIGHT,
  WORKER_STAKE_LAMPORTS,
  VALIDATOR_STAKE_LAMPORTS,
  AUTHORITY_KEYPAIR,
  TREASURY_KEYPAIR,
  WORKER_KEYPAIR,
  VALIDATOR1_KEYPAIR,
  VALIDATOR2_KEYPAIR,
  deriveProtocolPda,
  deriveNodePda,
  airdropSol,
} from "./helpers";

describe("01 - Setup", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Solarium as Program<Solarium>;
  const connection = provider.connection;

  before(async () => {
    await airdropSol(connection, AUTHORITY_KEYPAIR);
    await airdropSol(connection, WORKER_KEYPAIR);
    await airdropSol(connection, VALIDATOR1_KEYPAIR);
    await airdropSol(connection, VALIDATOR2_KEYPAIR);
  });

  it("initializes the protocol", async () => {
    await program.methods
      .initializeProtocol(TREASURY_KEYPAIR.publicKey)
      .accounts({ authority: AUTHORITY_KEYPAIR.publicKey })
      .signers([AUTHORITY_KEYPAIR])
      .rpc();

    const [protocolPda] = deriveProtocolPda(program.programId);
    const state = await program.account.protocolState.fetch(protocolPda);

    expect(state.authority.toBase58()).to.equal(AUTHORITY_KEYPAIR.publicKey.toBase58());
    expect(state.treasury.toBase58()).to.equal(TREASURY_KEYPAIR.publicKey.toBase58());
    expect(state.taskCounter.toNumber()).to.equal(0);
    expect(state.totalTasksCreated.toNumber()).to.equal(0);
    expect(state.activeWorkers).to.equal(0);
    expect(state.activeValidators).to.equal(0);
    expect(state.protocolFeeBps).to.equal(500);
  });

  it("registers a worker node", async () => {
    await program.methods
      .registerNode(WORKER_KEYPAIR.publicKey, WORKER_TYPE, TIER_HEAVY)
      .accounts({ operator: WORKER_KEYPAIR.publicKey })
      .signers([WORKER_KEYPAIR])
      .rpc();

    const [nodePda] = deriveNodePda(WORKER_KEYPAIR.publicKey, program.programId);
    const node = await program.account.nodeState.fetch(nodePda);

    expect(node.operator.toBase58()).to.equal(WORKER_KEYPAIR.publicKey.toBase58());
    expect(node.stake.toNumber()).to.equal(WORKER_STAKE_LAMPORTS);
    expect(node.reputation).to.equal(5_000);
    expect(node.tasksCompleted).to.equal(0);

    const [protocolPda] = deriveProtocolPda(program.programId);
    const protocol = await program.account.protocolState.fetch(protocolPda);
    expect(protocol.activeWorkers).to.equal(1);
  });

  it("registers validator 1", async () => {
    await program.methods
      .registerNode(VALIDATOR1_KEYPAIR.publicKey, VALIDATOR_TYPE, TIER_LIGHT)
      .accounts({ operator: VALIDATOR1_KEYPAIR.publicKey })
      .signers([VALIDATOR1_KEYPAIR])
      .rpc();

    const [nodePda] = deriveNodePda(VALIDATOR1_KEYPAIR.publicKey, program.programId);
    const node = await program.account.nodeState.fetch(nodePda);
    expect(node.stake.toNumber()).to.equal(VALIDATOR_STAKE_LAMPORTS);

    const [protocolPda] = deriveProtocolPda(program.programId);
    const protocol = await program.account.protocolState.fetch(protocolPda);
    expect(protocol.activeValidators).to.equal(1);
  });

  it("registers validator 2", async () => {
    await program.methods
      .registerNode(VALIDATOR2_KEYPAIR.publicKey, VALIDATOR_TYPE, TIER_LIGHT)
      .accounts({ operator: VALIDATOR2_KEYPAIR.publicKey })
      .signers([VALIDATOR2_KEYPAIR])
      .rpc();

    const [nodePda] = deriveNodePda(VALIDATOR2_KEYPAIR.publicKey, program.programId);
    const node = await program.account.nodeState.fetch(nodePda);
    expect(node.stake.toNumber()).to.equal(VALIDATOR_STAKE_LAMPORTS);

    const [protocolPda] = deriveProtocolPda(program.programId);
    const protocol = await program.account.protocolState.fetch(protocolPda);
    expect(protocol.activeValidators).to.equal(2);
  });
});
