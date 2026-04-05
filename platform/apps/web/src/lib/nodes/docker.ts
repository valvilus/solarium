import { spawn } from "child_process";

export interface NodeConfig {
  walletPubkey: string;
  apiKey: string;
  burnerSecret: string;
  role: "worker" | "validator";
  network: "localnet" | "devnet";
}

export function generateContainerName(pubkey: string, role: "worker" | "validator"): string {
  return `solarium-node-${role}-${pubkey.slice(0, 16)}`;
}

export async function runContainer(config: NodeConfig): Promise<boolean> {
  const containerName = generateContainerName(config.walletPubkey, config.role);

  await new Promise((resolve) => {
    const rmProc = spawn("docker", ["rm", "-f", containerName]);
    rmProc.on("close", resolve);
    rmProc.on("error", resolve);
  });

  return new Promise((resolve, reject) => {
    const proc = spawn("docker", [
      "run",
      "-d",
      "--name",
      containerName,
      "--network",
      "host",
      "-e",
      `NODE_ROLE=${config.role}`,
      "-e",
      `NODE_TIER=1`,
      "-e",
      `AI_MODEL=gemini`,
      "-e",
      `GEMINI_API_KEY=${config.apiKey}`,
      "-e",
      `REWARD_RECEIVER=${config.walletPubkey}`,
      "-e",
      `KEYPAIR_PATH=/app/wallet.json`,
      "-e",
      `RPC_URL=${config.network === "devnet" ? "https://api.devnet.solana.com" : "http://localhost:8899"}`,
      "-v",
      `${require("path").resolve(process.cwd(), "../../../agent/.storage")}:/app/agent/.storage`,
      "-v",
      `${require("path").resolve(process.cwd(), "../../../agent/src")}:/app/agent/src`,
      "--restart",
      "no",
      "solarium-agent:latest",
      "sh",
      "-c",
      `echo '${config.burnerSecret}' > /app/wallet.json && ls -la && pnpm start`,
    ]);

    proc.on("close", (code) => {
      if (code === 0) resolve(true);
      else reject(new Error(`Docker run failed with code ${code}`));
    });

    proc.on("error", (err) => reject(err));
  });
}

export async function stopContainer(pubkey: string, role: "worker" | "validator"): Promise<boolean> {
  const containerName = generateContainerName(pubkey, role);

  return new Promise((resolve, reject) => {
    const proc = spawn("docker", ["rm", "-f", containerName]);

    proc.on("close", (code) => {
      if (code === 0) resolve(true);
      else reject(new Error(`Docker rm failed with code ${code}`));
    });

    proc.on("error", (err) => reject(err));
  });
}
