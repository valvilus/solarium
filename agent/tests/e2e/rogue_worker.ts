import { BN } from "@coral-xyz/anchor";
import {
  SolariumClient,
  generateSalt,
  workerCommitment,
  Verdict,
  createStorageProvider,
  buildWorkerReport,
} from "@solarium-labs/sdk";
import type { StorageProvider } from "@solarium-labs/sdk";
import { initChain } from "../../src/chain";
import { loadConfig } from "../../src/config";
import { logStep, logKeyValue, logDivider, logHeader } from "../../src/logger";
import { findTasksByStatus, waitForRevealPhase, sleep } from "../../src/tasks";

const POLL_INTERVAL_MS = 5_000;
const EMPTY_HASH: number[] = new Array(32).fill(0);

async function processTask(client: SolariumClient, taskId: BN, storage: StorageProvider): Promise<void> {
  logStep("CLAIM", `[ROGUE] Claiming task ${taskId.toString()}`);
  await client.claimTask(taskId);

  logStep("INFER", `[ROGUE] Faking AI inference...`);
  const result = {
    verdict: Verdict.Approved,
    confidence: 100,
    reasoning: "I am a rogue worker. I bypass the LLM and approve everything to steal money!",
  };

  logStep("STORAGE", "[ROGUE] Uploading False Report");
  const report = buildWorkerReport(taskId.toString(), "local://rogue-attack", client.walletKey.toBase58(), {
    verdict: result.verdict,
    reasoning: result.reasoning,
  });

  const uploadRes = await storage.uploadJson(report);
  logKeyValue("Report URI", uploadRes.uri);

  const salt = generateSalt();
  const commitment = workerCommitment(result.verdict, result.confidence, salt);

  await client.commitResult(taskId, {
    commitment,
    reasoningHash: uploadRes.hashArray,
    traceHash: EMPTY_HASH,
  });

  await waitForRevealPhase(client, taskId);

  await client.revealResult(taskId, result.verdict, result.confidence, Array.from(salt));
  logStep("DONE", `[ROGUE] Task ${taskId.toString()} completed with LIES`);
  logDivider();
}

async function startRogueLoop() {
  process.env.NODE_ROLE = "worker";
  const config = loadConfig();
  const ctx = await initChain(config);
  const storage = createStorageProvider(config.pinataJwt);

  logHeader("ROGUE WORKER ACTIVE - PREPARE FOR FRAUD");

  while (true) {
    try {
      const openTasks = await findTasksByStatus(ctx.client, "open");
      if (openTasks.length > 0) {
        await processTask(ctx.client, openTasks[0].account.taskId, storage);
      }
    } catch (err: unknown) {
      logStep("ERROR", String(err));
    }
    await sleep(POLL_INTERVAL_MS);
  }
}

startRogueLoop();
