import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { SolariumClient, TaskType, deriveProtocolPda } from "./src";
import fs from "fs";
import { BN } from "bn.js";

async function main() {
  const connection = new Connection("http://localhost:8899", "confirmed");

  const wallet = Keypair.generate();

  await connection.requestAirdrop(wallet.publicKey, 2 * LAMPORTS_PER_SOL);
  await new Promise((r) => setTimeout(r, 2000));

  const provider = new AnchorProvider(connection, new Wallet(wallet), { commitment: "confirmed" });
  const client = new SolariumClient(provider);

  console.log("Submitting test task...");

  const dummyInputHash = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2,
  ];

  const sig = await client.createTask({
    inputHash: dummyInputHash,
    taskType: TaskType.TextGeneration,
    tier: 1,
    reward: new BN(100),
    validatorCount: 1,
  });

  console.log("Task submitted! Tx:", sig.signature);
  console.log("Task ID:", sig.taskId.toString());
}

main().catch(console.error);
