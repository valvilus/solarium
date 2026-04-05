import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

const SEED_PROTOCOL = Buffer.from("protocol");
const SEED_NODE = Buffer.from("node");
const SEED_TASK = Buffer.from("task");
const SEED_COMMIT = Buffer.from("commit");

export function deriveProtocolPda(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([SEED_PROTOCOL], programId);
}

export function deriveNodePda(operator: PublicKey, programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([SEED_NODE, operator.toBuffer()], programId);
}

export function deriveTaskPda(taskId: BN, programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([SEED_TASK, taskId.toArrayLike(Buffer, "le", 8)], programId);
}

export function deriveCommitPda(taskKey: PublicKey, operator: PublicKey, programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([SEED_COMMIT, taskKey.toBuffer(), operator.toBuffer()], programId);
}
