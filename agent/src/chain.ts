import { readFileSync } from "fs";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Wallet, BN, utils } from "@coral-xyz/anchor";
import { SolariumClient, NodeType } from "@solarium-labs/sdk";
import type { AgentConfig } from "./config";

export type ChainContext = {
  readonly client: SolariumClient;
  readonly keypair: Keypair;
  readonly connection: Connection;
  readonly operatorKey: PublicKey;
};

function loadKeypair(path: string): Keypair {
  const raw = readFileSync(path, "utf-8").trim();
  if (raw.startsWith("[")) {
    const secret = Uint8Array.from(JSON.parse(raw));
    return Keypair.fromSecretKey(secret);
  } else {
    const secret = utils.bytes.bs58.decode(raw);
    return Keypair.fromSecretKey(secret);
  }
}

function createProvider(config: AgentConfig, keypair: Keypair): AnchorProvider {
  const connection = new Connection(config.rpcUrl, "confirmed");
  const wallet = new Wallet(keypair);
  return new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });
}

function nodeTypeFromRole(role: AgentConfig["nodeRole"]): number {
  return role === "worker" ? NodeType.Worker : NodeType.Validator;
}

async function ensureRegistered(client: SolariumClient, config: AgentConfig, operatorKey: PublicKey): Promise<void> {
  try {
    await client.fetchNode(operatorKey);
    console.info(`Node registered via Operator: ${operatorKey.toBase58()}`);
  } catch {
    if (config.rewardReceiver) {
      console.warn(
        `[WARNING] Node not yet registered on-chain by Operator. The Burner Wallet (${client.walletKey.toBase58()}) expects Operator (${operatorKey.toBase58()}) to call registerNode.`
      );
      return;
    }

    console.info("Node not registered. Registering standard operator node...");
    const nodeType = nodeTypeFromRole(config.nodeRole);
    const sig = await client.registerNode(client.walletKey, nodeType, config.nodeTier);
    console.info(`Registered as ${config.nodeRole} (tier ${config.nodeTier})`);
    console.info(`Transaction: ${sig}`);

    try {
      const extraStake = new BN("10000000000");
      await client.depositStake(extraStake);
      console.info(`[DEMO SETUP] Deposited +10 SOL stake to bypass lockups`);
    } catch (e: any) {
      if (!e.message?.includes("NodeNotActive")) {
        console.info(`[DEMO SETUP] Extra stake deposit skipped: ${e.message}`);
      }
    }
  }
}

export async function initChain(config: AgentConfig): Promise<ChainContext> {
  const keypair = loadKeypair(config.keypairPath);
  const provider = createProvider(config, keypair);
  const client = new SolariumClient(provider);

  const operatorKey = config.rewardReceiver ? new PublicKey(config.rewardReceiver) : keypair.publicKey;

  console.info(`Worker Wallet (Signer): ${keypair.publicKey.toBase58()}`);
  console.info(`Operator Safe: ${operatorKey.toBase58()}`);
  console.info(`RPC: ${config.rpcUrl}`);
  console.info(`Program: ${client.programId.toBase58()}`);

  await ensureRegistered(client, config, operatorKey);

  return {
    client,
    keypair,
    connection: provider.connection,
    operatorKey,
  };
}
