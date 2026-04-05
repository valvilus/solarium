import { loadConfig } from "./config";
import { Connection, Keypair } from "@solana/web3.js";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { SolariumClient } from "@solarium-labs/sdk";
import { readFileSync } from "fs";

function loadKeypair(path: string): Keypair {
  const raw = readFileSync(path, "utf-8");
  return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw)));
}

async function run() {
  const config = loadConfig();
  const keypair = loadKeypair(config.keypairPath);
  const connection = new Connection(config.rpcUrl, "confirmed");
  const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed" });
  const client = new SolariumClient(provider);

  try {
    const sig = await client.initializeProtocol(client.walletKey);
    console.log("Protocol initialized successfully:", sig);
  } catch (e: any) {
    if (e.message.includes("already in use")) {
      console.log("Protocol already initialized.");
    } else {
      console.error(e.message);
    }
  }
}
run().catch(console.error);
