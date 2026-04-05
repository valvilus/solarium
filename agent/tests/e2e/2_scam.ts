import { resolve } from "path";
import { rmSync, mkdirSync } from "fs";
import { setupNode, createClient, airdropSol } from "./utils/chain_setup";
import { startRogueWorker, startAgent, killAllAgents } from "./utils/cluster";
import { buildManifest, createStorageProvider, TaskType } from "@solarium-labs/sdk";
import { Keypair } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

async function run() {
  console.log("=== SCENARIO 2: SCAM ATTEMPT ===");
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
      await dappClient.initializeProtocol(dappKey.publicKey);
    }

    console.log("Setting up agents...");
    await setupNode("worker", 1, resolve(keysDir, "rogue_worker.json"));
    await setupNode("validator", 1, resolve(keysDir, "true_validator.json"));
    await setupNode("validator", 1, resolve(keysDir, "keeper1.json"));

    startRogueWorker(resolve(keysDir, "rogue_worker.json"));
    startAgent("validator", resolve(keysDir, "true_validator.json"));
    startAgent("keeper", resolve(keysDir, "keeper1.json"));

    const storage = createStorageProvider(undefined);
    const manifest = buildManifest(
      "Elevator Repair Verification",
      "verify_price",
      "Quote: $55,000 to replace KONE elevator motor. Wait, actually this quote is clearly fake. Labor is $1,000,000. Is this a scam?",
      "Analyze the quote. If labor is 1 million, it is a scam! Output {verdict: 2} for suspicious.",
      "Verify the worker's logic. If the worker flagged the 1 million labor as suspicious or rejected, vote agree. If the worker approved it, vote disagree.",
      {
        verdict: 0,
        reasoning: "string",
      }
    );

    const uploadRes = await storage.uploadJson(manifest);
    console.log("Manifest uploaded:", uploadRes.uri);

    const taskRes = await dappClient.createTask({
      taskType: 0,
      tier: 1,
      reward: new BN(1e9),
      validatorCount: 1,
      inputHash: uploadRes.hashArray,
    });
    console.log(`Task created! Task ID: ${taskRes.taskId}`);

    console.log("Waiting for agents to process (~40-60 secs for Reveal Phase)...");
    const result = await dappClient.waitForVerdict(taskRes.taskId, 120_000);

    console.log("\n=== FINAL RESULT ===");
    console.log(`Verdict: ${JSON.stringify(result.verdict)}`);

    if ("invalidated" in result.status || "disputed" in result.status) {
      console.log("SCAM DETECTED: Validator disagreed with rogue worker — stake slashed.");
    } else {
      console.log("RESULT: Consensus reached — Verdict:", JSON.stringify(result.verdict));
    }
  } catch (e) {
    console.error("Test failed:", e);
  } finally {
    killAllAgents();
    process.exit(0);
  }
}

run();
