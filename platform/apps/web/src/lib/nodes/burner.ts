import { Keypair } from "@solana/web3.js";

export function generateBurner() {
  const burner = Keypair.generate();
  return {
    publicKey: burner.publicKey.toBase58(),
    secret: JSON.stringify(Array.from(burner.secretKey)),
  };
}
