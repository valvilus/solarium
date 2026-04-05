const { Connection, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { AnchorProvider, Wallet } = require("@coral-xyz/anchor");
const { SolariumClient, TaskType, deriveProtocolPda } = require("./dist/index.js");
const BN = require("bn.js");

async function main() {
  const connection = new Connection("http://localhost:8899", "confirmed");
  const wallet = Keypair.generate();

  await connection.requestAirdrop(wallet.publicKey, 2 * LAMPORTS_PER_SOL);
  await new Promise((r) => setTimeout(r, 2000));

  const provider = new AnchorProvider(connection, new Wallet(wallet), { commitment: "confirmed" });
  const client = new SolariumClient(provider);

  const sig = await client.createTask({
    inputHash: Array(32).fill(1),
    taskType: 0,
    tier: 1,
    reward: new BN(100),
    validatorCount: 1,
  });
  console.log("Task submitted! Tx:", sig.signature);
}
main().catch(console.error);
