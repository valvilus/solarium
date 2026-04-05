import { createHash, randomBytes } from "crypto";

export function generateSalt(): Buffer {
  return randomBytes(32);
}

export function workerCommitment(verdict: number, confidence: number, salt: Buffer): number[] {
  const input = Buffer.concat([Buffer.from([verdict, confidence]), salt]);
  return sha256(input);
}

export function validatorCommitment(vote: number, salt: Buffer): number[] {
  const input = Buffer.concat([Buffer.from([vote]), salt]);
  return sha256(input);
}

function sha256(data: Buffer): number[] {
  const hash = createHash("sha256").update(data).digest();
  return Array.from(hash);
}
