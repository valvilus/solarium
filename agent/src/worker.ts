import { BN } from "@coral-xyz/anchor";
import {
  SolariumClient,
  generateSalt,
  workerCommitment,
  Verdict,
  createStorageProvider,
  buildWorkerReport,
} from "@solarium-labs/sdk";
import type { StorageProvider, TaskManifest } from "@solarium-labs/sdk";
import type { ChainContext } from "./chain";
import type { AgentConfig } from "./config";
import { createGeminiClient, extractJson } from "./gemini";
import { logStep, logKeyValue, logDivider, logHeader, logMetric } from "./logger";
import { findTasksByStatus, waitForRevealPhase, sleep } from "./tasks";

const POLL_INTERVAL_MS = 5_000;
const EMPTY_HASH: number[] = new Array(32).fill(0);

type InferenceResult = {
  readonly verdict: number;
  readonly confidence: number;
  readonly reasoning: string;
};

type GeminiInferenceResponse = InferenceResult;

const INFERENCE_PROMPT = `You are a Solarium Protocol AI worker node.
Analyze the following on-chain task input and determine legitimacy.
Respond ONLY with valid JSON (no markdown):
{"verdict": <1 for Approved, 2 for Suspicious, 3 for Rejected>, "confidence": <0-100>, "reasoning": "<brief explanation>"}

Task input hash: `;

function mockInference(): InferenceResult {
  return {
    verdict: Verdict.Approved,
    confidence: 95,
    reasoning: "Mock analysis: content appears legitimate",
  };
}

async function geminiInference(apiKey: string, taskId: BN, manifest: TaskManifest | null): Promise<InferenceResult> {
  const client = createGeminiClient(apiKey);

  let prompt: string;
  if (manifest && manifest.workerPrompt) {
    prompt = `${manifest.workerPrompt}\n\nTask Input Data:\n${JSON.stringify(manifest.inputData)}\n\nRespond ONLY with valid JSON exactly matching this schema: ${JSON.stringify(manifest.expectedSchema)}\n\nInclude a numeric 'verdict' (1 for Approved, 2 for Suspicious, 3 for Rejected), 'confidence' (0-100), and 'reasoning' (string).`;
  } else {
    prompt = `${INFERENCE_PROMPT}${taskId.toString()}`;
  }

  const raw = await client.generate(prompt);
  const parsed = extractJson<any>(raw);

  const verdictNum = parseInt(String(parsed?.verdict).match(/\d+/)?.[0] || "", 10);
  const confidenceNum = parseInt(String(parsed?.confidence).match(/\d+/)?.[0] || "", 10);

  if (!parsed || isNaN(confidenceNum) || isNaN(verdictNum)) {
    return {
      verdict: Verdict.Suspicious,
      confidence: 50,
      reasoning: parsed?.reasoning ?? "LLM returned non-parseable or injected response",
    };
  }

  const clampedConfidence = Math.max(0, Math.min(100, confidenceNum));
  const clampedVerdict = [0, 1, 2, 3, 4].includes(verdictNum) ? verdictNum : Verdict.Suspicious;

  return {
    verdict: clampedVerdict,
    confidence: clampedConfidence,
    reasoning: parsed.reasoning,
  };
}

function selectInference(config: AgentConfig): (taskId: BN, manifest: TaskManifest | null) => Promise<InferenceResult> {
  if (config.aiModel === "gemini" && config.geminiApiKey) {
    return (taskId, manifest) => geminiInference(config.geminiApiKey as string, taskId, manifest);
  }
  return () => Promise.resolve(mockInference());
}

async function processTask(
  ctx: ChainContext,
  taskId: BN,
  infer: (taskId: BN, manifest: TaskManifest | null) => Promise<InferenceResult>,
  storage: StorageProvider,
  config: AgentConfig
): Promise<void> {
  const client = ctx.client;
  logStep("CLAIM", `Claiming task ${taskId.toString()}`);
  await client.claimTask(taskId, ctx.operatorKey);

  const task = await client.fetchTask(taskId);
  const inputHash = Array.from(task.inputHash as number[]);
  const isEmptyHash = inputHash.every((b) => b === 0);
  let manifest: TaskManifest | null = null;
  let manifestUri = "local://generic-manifest";

  if (!isEmptyHash) {
    const hashHex = Buffer.from(inputHash).toString("hex");
    manifestUri = config.pinataJwt ? `ipfs://${hashHex}` : `local://${hashHex}`;
    try {
      logStep("FETCH", `Downloading TaskManifest from ${manifestUri}`);
      manifest = await storage.downloadJson<TaskManifest>(manifestUri);
    } catch {
      logStep("WARN", `Failed to download manifest from ${manifestUri}`);
    }
  }

  logStep("INFER", `Running AI inference for task ${taskId.toString()}`);
  const result = await infer(taskId, manifest);
  logKeyValue("Verdict", String(result.verdict));
  logKeyValue("Confidence", `${result.confidence}%`);
  logKeyValue("Reasoning", result.reasoning);

  logStep("STORAGE", "Uploading WorkerReport to Offchain Storage");
  const report = buildWorkerReport(taskId.toString(), manifestUri, client.walletKey.toBase58(), {
    verdict: result.verdict,
    reasoning: result.reasoning,
  });

  const uploadRes = await storage.uploadJson(report);
  logKeyValue("Report URI", uploadRes.uri);

  const salt = generateSalt();
  const commitment = workerCommitment(result.verdict, result.confidence, salt);

  logStep("COMMIT", `Submitting commitment for task ${taskId.toString()}`);
  await client.commitResult(
    taskId,
    {
      commitment,
      reasoningHash: uploadRes.hashArray,
      traceHash: EMPTY_HASH,
    },
    ctx.operatorKey
  );

  logMetric("INFERENCE_DONE", {
    workerHash: uploadRes.uri.split("local://")[1] || uploadRes.uri.slice(-16),
    workerVerdict: result.verdict,
    workerReasoning: result.reasoning,
  });

  await waitForRevealPhase(client, taskId);

  logStep("REVEAL", `Revealing result for task ${taskId.toString()}`);
  await client.revealResult(taskId, result.verdict, result.confidence, Array.from(salt), ctx.operatorKey);

  try {
    const updated = await client.fetchTask(taskId);
    if (updated.revealsReceived === updated.validatorCount + 1) {
      logStep("FINALIZE", `Reaching Consensus and Finalizing task ${taskId.toString()}`);
      await client.finalizeTask(taskId);
    }
  } catch (e: any) {}

  logStep("DONE", `Task ${taskId.toString()} completed`);
  logDivider();
}

export async function startWorkerLoop(ctx: ChainContext, config: AgentConfig): Promise<void> {
  logHeader("WORKER NODE ACTIVE");
  const infer = selectInference(config);
  const storage = createStorageProvider(config.pinataJwt);

  logStep("MODE", `AI model: ${config.aiModel.toUpperCase()}`);
  logStep("STORAGE", config.pinataJwt ? "Pinata IPFS Provider" : "Local Storage Provider");
  logDivider();

  while (true) {
    try {
      const openTasks = await findTasksByStatus(ctx.client, "open");

      if (openTasks.length > 0) {
        const taskId = openTasks[0].account.taskId;
        await processTask(ctx, taskId, infer, storage, config);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      logStep("ERROR", message);
    }

    await sleep(POLL_INTERVAL_MS);
  }
}
