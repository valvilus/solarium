import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { SolariumClient, deriveProtocolPda } from "./src";

async function main() {
  const connection = new Connection("http://localhost:8899", "confirmed");
  const wallet = Keypair.generate();

  await connection.requestAirdrop(wallet.publicKey, 2 * LAMPORTS_PER_SOL);
  await new Promise((r) => setTimeout(r, 2000));

  const provider = new AnchorProvider(connection, new Wallet(wallet), { commitment: "confirmed" });
  const client = new SolariumClient(provider);

  const [pda] = deriveProtocolPda(client.programId);
  try {
    await client.program.account.protocolState.fetch(pda);
    console.log("Protocol already initialized.");
  } catch {
    console.log("Initializing protocol...");
    const sig = await client.initializeProtocol(wallet.publicKey);
    console.log("Initialized Tx:", sig);
  }
}

main().catch(console.error);
