import { Keypair } from "@solana/web3.js";

function seedFromByte(b: number): Uint8Array {
  return new Uint8Array(32).fill(b);
}

export const AUTHORITY_KEYPAIR = Keypair.fromSeed(seedFromByte(1));
export const TREASURY_KEYPAIR = Keypair.fromSeed(seedFromByte(2));
export const WORKER_KEYPAIR = Keypair.fromSeed(seedFromByte(3));
export const VALIDATOR1_KEYPAIR = Keypair.fromSeed(seedFromByte(4));
export const VALIDATOR2_KEYPAIR = Keypair.fromSeed(seedFromByte(5));
export const ALICE_KEYPAIR = Keypair.fromSeed(seedFromByte(6));
