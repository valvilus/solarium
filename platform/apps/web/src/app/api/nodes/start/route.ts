import { NextResponse } from "next/server";
import { runContainer } from "@/lib/nodes/docker";
import { generateBurner } from "@/lib/nodes/burner";
import { Connection, LAMPORTS_PER_SOL, PublicKey, Keypair } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { pubkey, role, burnerSecret, burnerPubkey, network } = body;

    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      try {
        const envPath = require("path").resolve(process.cwd(), "../../../agent/.env");
        const envFile = require("fs").readFileSync(envPath, "utf-8");
        const match = envFile.match(/^GEMINI_API_KEY=(.*)$/m);
        if (match) apiKey = match[1].trim();
      } catch (e) {
        console.error("Failed to read agent/.env file");
      }
    }

    if (!pubkey || !apiKey) {
      return NextResponse.json(
        { error: "Missing required integration parameters or GEMINI_API_KEY is not set in agent/.env" },
        { status: 400 }
      );
    }

    let burner;
    if (burnerSecret && burnerPubkey) {
      burner = { secret: burnerSecret, publicKey: burnerPubkey };
    } else {
      burner = generateBurner();
    }

    if (network === "devnet") {
      const botId = role === "validator" ? 2 : 1;
      const poolDir = path.join(process.cwd(), "bot_pool");

      try {
        const opSecret = JSON.parse(fs.readFileSync(path.join(poolDir, `op${botId}.json`), "utf-8"));
        const burnSecret = JSON.parse(fs.readFileSync(path.join(poolDir, `burner${botId}.json`), "utf-8"));

        const opKp = Keypair.fromSecretKey(new Uint8Array(opSecret));
        pubkey = opKp.publicKey.toBase58();
        burner.secret = JSON.stringify(burnSecret);
        burner.publicKey = Keypair.fromSecretKey(new Uint8Array(burnSecret)).publicKey.toBase58();

        console.log(`[Devnet Interceptor] Injected Immortal Bot #${botId} for role: ${role}`);
      } catch (err) {
        console.error("Failed to inject immortal bot from pool! Make sure you ran setup_bot_pool.ts", err);
        return NextResponse.json({ error: "Devnet Pool not initialized. Run setup pool script." }, { status: 500 });
      }
    } else {
      try {
        const rpcUrl = "http://localhost:8899";
        const conn = new Connection(rpcUrl, "confirmed");
        const pkey = new PublicKey(burner.publicKey);

        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Airdrop timeout")), 3000));

        const airdropPromise = async () => {
          const sig = await conn.requestAirdrop(pkey, 2.5 * LAMPORTS_PER_SOL);
          const latestBlockhash = await conn.getLatestBlockhash("confirmed");
          await conn.confirmTransaction(
            {
              signature: sig,
              blockhash: latestBlockhash.blockhash,
              lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            },
            "confirmed"
          );
        };

        await Promise.race([airdropPromise(), timeoutPromise]);
      } catch (e) {
        console.warn("Airdrop skipped or timed out, assuming faucet coverage:", (e as any).message);
      }
    }

    await runContainer({
      walletPubkey: pubkey,
      apiKey: apiKey,
      burnerSecret: burner.secret,
      role: role || "worker",
      network: network || "localnet",
    });

    return NextResponse.json({
      success: true,
      burnerPubkey: burner.publicKey,
      message: "Node deployed securely in isolated container.",
    });
  } catch (error) {
    console.error("Deploy Error:", error);
    return NextResponse.json({ error: (error as any).message }, { status: 500 });
  }
}
