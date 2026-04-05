import { resolve } from "path";
import { existsSync } from "fs";

const VALID_ROLES = ["worker", "validator", "keeper"] as const;
const VALID_AI_MODELS = ["mock", "gemini"] as const;
const MIN_TIER = 1;
const MAX_TIER = 3;

type NodeRole = (typeof VALID_ROLES)[number];
type AiModel = (typeof VALID_AI_MODELS)[number];

export type AgentConfig = {
  readonly rpcUrl: string;
  readonly keypairPath: string;
  readonly nodeRole: NodeRole;
  readonly nodeTier: number;
  readonly aiModel: AiModel;
  readonly geminiApiKey: string | undefined;
  readonly pinataJwt: string | undefined;
  readonly rewardReceiver: string | undefined;
};

function requiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
  return value;
}

function resolveKeypairPath(raw: string): string {
  const expanded = raw.replace(/^~/, process.env.HOME ?? "");
  const absolute = resolve(expanded);
  if (!existsSync(absolute)) {
    console.error(`Keypair file not found: ${absolute}`);
    process.exit(1);
  }
  return absolute;
}

function parseRole(raw: string): NodeRole {
  const lower = raw.toLowerCase() as NodeRole;
  if (!VALID_ROLES.includes(lower)) {
    console.error(`Invalid NODE_ROLE: ${raw}. Must be: ${VALID_ROLES.join(", ")}`);
    process.exit(1);
  }
  return lower;
}

function parseTier(raw: string): number {
  const tier = parseInt(raw, 10);
  if (isNaN(tier) || tier < MIN_TIER || tier > MAX_TIER) {
    console.error(`Invalid NODE_TIER: ${raw}. Must be ${MIN_TIER}-${MAX_TIER}`);
    process.exit(1);
  }
  return tier;
}

function parseAiModel(raw: string): AiModel {
  const lower = raw.toLowerCase() as AiModel;
  if (!VALID_AI_MODELS.includes(lower)) {
    console.error(`Invalid AI_MODEL: ${raw}. Must be: ${VALID_AI_MODELS.join(", ")}`);
    process.exit(1);
  }
  return lower;
}

export function loadConfig(): AgentConfig {
  const aiModel = parseAiModel(requiredEnv("AI_MODEL"));

  if (aiModel === "gemini" && !process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is required when AI_MODEL=gemini");
    process.exit(1);
  }

  return {
    rpcUrl: requiredEnv("RPC_URL"),
    keypairPath: resolveKeypairPath(requiredEnv("KEYPAIR_PATH")),
    nodeRole: parseRole(requiredEnv("NODE_ROLE")),
    nodeTier: parseTier(requiredEnv("NODE_TIER")),
    aiModel,
    geminiApiKey: process.env.GEMINI_API_KEY || undefined,
    pinataJwt: process.env.PINATA_JWT || undefined,
    rewardReceiver: process.env.REWARD_RECEIVER || undefined,
  };
}
