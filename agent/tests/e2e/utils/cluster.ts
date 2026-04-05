import { spawn, ChildProcess } from "child_process";
import { resolve } from "path";
import "dotenv/config";

const processes: ChildProcess[] = [];

export function startAgent(role: "worker" | "validator" | "keeper", keypairPath: string, extraEnv = {}) {
  const env = {
    ...process.env,
    RPC_URL: "http://127.0.0.1:8899",
    KEYPAIR_PATH: resolve(keypairPath),
    NODE_ROLE: role,
    NODE_TIER: "1",
    AI_MODEL: "gemini",
    ...extraEnv,
  };

  const scriptPath = resolve(__dirname, "../../../src/index.ts");

  const child = spawn("npx", ["tsx", scriptPath], {
    env,
    stdio: "inherit",
  });

  processes.push(child);
  console.log(`[CLUSTER] Started ${role} agent with PID ${child.pid}`);
  return child;
}

export function startRogueWorker(keypairPath: string) {
  const env = {
    ...process.env,
    RPC_URL: "http://127.0.0.1:8899",
    KEYPAIR_PATH: resolve(keypairPath),
    NODE_ROLE: "worker",
    NODE_TIER: "1",
  };

  const scriptPath = resolve(__dirname, "../rogue_worker.ts");

  const child = spawn("npx", ["tsx", scriptPath], {
    env,
    stdio: "inherit",
  });

  processes.push(child);
  console.log(`[CLUSTER] Started Rogue Worker with PID ${child.pid}`);
  return child;
}

export function killAllAgents() {
  console.log("[CLUSTER] Shutting down all agents...");
  for (const p of processes) {
    p.kill("SIGKILL");
  }
}
