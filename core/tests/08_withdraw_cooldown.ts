import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import { Solarium } from "../target/types/solarium";
import { ALICE_KEYPAIR, deriveNodePda, airdropSol } from "./helpers";

describe("08 - Withdraw Cooldown", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Solarium as Program<Solarium>;
  const connection = provider.connection;

  const WITHDRAWAL_AMOUNT = new BN(1_000_000_000);
  let nodePda: PublicKey;

  before(async () => {
    await airdropSol(connection, ALICE_KEYPAIR);
    [nodePda] = deriveNodePda(ALICE_KEYPAIR.publicKey, program.programId);
  });

  it("requests withdrawal, locking free stake into withdrawal amount", async () => {
    const NEW_OPERATOR = anchor.web3.Keypair.generate();
    await airdropSol(connection, NEW_OPERATOR);
    const [newNodePda] = deriveNodePda(NEW_OPERATOR.publicKey, program.programId);

    await program.methods.registerNode(0).accounts({ operator: NEW_OPERATOR.publicKey }).signers([NEW_OPERATOR]).rpc();

    let node = await program.account.nodeState.fetch(newNodePda);
    const freeStakeBefore = node.freeStake.toNumber();

    await program.methods
      .requestWithdrawal(WITHDRAWAL_AMOUNT)
      .accountsPartial({
        operator: NEW_OPERATOR.publicKey,
        nodeState: newNodePda,
      })
      .signers([NEW_OPERATOR])
      .rpc();

    node = await program.account.nodeState.fetch(newNodePda);
    expect(node.freeStake.toNumber()).to.equal(freeStakeBefore - WITHDRAWAL_AMOUNT.toNumber());
    expect(node.withdrawalAmount.toNumber()).to.equal(WITHDRAWAL_AMOUNT.toNumber());
    expect(node.unlockEpoch.toNumber()).to.be.greaterThan(0);

    try {
      await program.methods
        .executeWithdrawal()
        .accountsPartial({
          operator: NEW_OPERATOR.publicKey,
          nodeState: newNodePda,
        })
        .signers([NEW_OPERATOR])
        .rpc();
      expect.fail("Expected CooldownNotComplete error");
    } catch (e) {
      expect(String(e)).to.include("CooldownNotComplete");
    }
  });
});
