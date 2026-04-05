import { resolve } from "path";
import { rmSync, mkdirSync } from "fs";
import { setupNode, createClient, airdropSol } from "./utils/chain_setup";
import { startAgent, killAllAgents } from "./utils/cluster";
import { buildManifest, createStorageProvider, TaskType } from "@solarium-labs/sdk";
import { Keypair } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

async function run() {
  console.log("=== SCENARIO 1: HAPPY PATH ===");
  try {
    const keysDir = resolve(__dirname, "keys");
    rmSync(keysDir, { recursive: true, force: true });
    mkdirSync(keysDir, { recursive: true });

    const dappKey = Keypair.generate();
    const dappClient = await createClient(dappKey);
    await airdropSol(dappClient.program.provider.connection, dappKey.publicKey, 100);

    try {
      await dappClient.fetchProtocol();
    } catch {
      console.log("Initializing protocol...");
      await dappClient.initializeProtocol(dappKey.publicKey);
    }

    console.log("Setting up agents...");
    await setupNode("worker", 1, resolve(keysDir, "worker1.json"));
    await setupNode("validator", 1, resolve(keysDir, "validator1.json"));
    await setupNode("validator", 1, resolve(keysDir, "keeper1.json"));

    startAgent("worker", resolve(keysDir, "worker1.json"));
    startAgent("validator", resolve(keysDir, "validator1.json"));
    startAgent("keeper", resolve(keysDir, "keeper1.json"));

    console.log("Building Elevator Quote Request...");
    const storage = createStorageProvider(undefined);

    const manifest = buildManifest(
      "Elevator Repair Verification",
      "verify_price",
      "Quote: $55,000 to replace KONE elevator motor at residential building 'Sunrise'. Parts: $30k. Labor: $25k for 5 days.",
      "Analyze the elevator repair quote. Is $55k reasonable for a KONE motor replacement? Respond with verdict: 0 (Approved) if fair, 1 (Suspicious) if overpriced.",
      "Verify the worker's logic. If it is reasonable and uses analytical thinking, vote agree. If it hallucinates, vote disagree.",
      {
        verdict: 0,
        reasoning: "string",
      }
    );

    const uploadRes = await storage.uploadJson(manifest);
    console.log("Manifest uploaded:", uploadRes.uri);

    console.log("Creating Task on-chain...");
    const taskRes = await dappClient.createTask({
      taskType: 0,
      tier: 1,
      reward: new BN(1e9),
      validatorCount: 1,
      inputHash: uploadRes.hashArray,
    });

    console.log(`Task created! Task ID: ${taskRes.taskId}`);

    console.log("Waiting for agents to process (~40-60 secs for Reveal Phase)...");
    const result = await dappClient.waitForVerdict(taskRes.taskId, 400_000);

    console.log("\n=== FINAL RESULT ===");
    console.log(`Verdict: ${JSON.stringify(result.verdict)}`);
    console.log(`Confidence: ${result.confidence}%`);
  } catch (e) {
    console.error("Test failed:", e);
  } finally {
    killAllAgents();
    process.exit(0);
  }
}

run();
