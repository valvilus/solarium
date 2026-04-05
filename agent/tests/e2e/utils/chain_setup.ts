import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Wallet, BN } from "@coral-xyz/anchor";
import { SolariumClient, NodeType } from "@solarium-labs/sdk";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname } from "path";

const RPC_URL = "http://localhost:8899";

export async function airdropSol(connection: Connection, publicKey: PublicKey, amount: number) {
  const sig = await connection.requestAirdrop(publicKey, amount * 1e9);
  const blockhash = await connection.getLatestBlockhash("confirmed");
  await connection.confirmTransaction(
    {
      signature: sig,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    },
    "confirmed"
  );
  console.log(`Airdropped ${amount} SOL to ${publicKey.toBase58()}`);
}

export function saveKeypair(path: string, keypair: Keypair) {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(path, `[${keypair.secretKey.toString()}]`);
}

export async function createClient(keypair: Keypair): Promise<SolariumClient> {
  const connection = new Connection(RPC_URL, "confirmed");
  const wallet = new Wallet(keypair);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });
  return new SolariumClient(provider);
}

export async function setupNode(role: "worker" | "validator", tier: number, keyPath: string): Promise<Keypair> {
  const keypair = Keypair.generate();
  saveKeypair(keyPath, keypair);

  const client = await createClient(keypair);
  await airdropSol(client.program.provider.connection, keypair.publicKey, 10);

  const nodeType = role === "worker" ? NodeType.Worker : NodeType.Validator;
  await client.registerNode(nodeType, tier);
  console.log(`Registered ${role} at ${keypair.publicKey.toBase58()} (Tier ${tier})`);

  await client.depositStake(new BN(5 * 1e9));

  return keypair;
}
