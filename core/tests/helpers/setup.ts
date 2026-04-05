import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { AIRDROP_AMOUNT } from "./constants";

export async function createFundedKeypair(connection: Connection): Promise<Keypair> {
  const kp = Keypair.generate();
  const sig = await connection.requestAirdrop(kp.publicKey, AIRDROP_AMOUNT);
  await connection.confirmTransaction(sig, "confirmed");
  return kp;
}

export async function airdropSol(
  connection: Connection,
  to: Keypair,
  lamports: number = AIRDROP_AMOUNT
): Promise<void> {
  const sig = await connection.requestAirdrop(to.publicKey, lamports);
  await connection.confirmTransaction(sig, "confirmed");
}
