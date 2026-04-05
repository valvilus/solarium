"use client";

import { useState } from "react";
import { Vault, CurrencyCircleDollar, Browser, TextT } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { SolariumClient, TaskType, hashJson } from "@solarium-labs/sdk";
import { toast } from "sonner";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function SandboxEscrowWidget() {
  const t = useTranslations("Explorer");
  const { connection } = useConnection();
  const wallet = useWallet();
  const [prompt, setPrompt] = useState("");
  const [reward, setReward] = useState("0");
  const [isDeploying, setIsDeploying] = useState(false);

  const handleCreateTask = async () => {
    if (!prompt) {
      toast.error("Please enter a test prompt.");
      return;
    }

    setIsDeploying(true);
    try {
      const senderKp = require("@solana/web3.js").Keypair.generate();

      toast.info("Airdropping test SOL for transaction...");
      const sig1 = await connection.requestAirdrop(senderKp.publicKey, 10 * LAMPORTS_PER_SOL);
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: sig1,
        },
        "confirmed"
      );

      const dummyWallet = {
        publicKey: senderKp.publicKey,
        signTransaction: async (tx: any) => {
          tx.partialSign(senderKp);
          return tx;
        },
        signAllTransactions: async (txs: any[]) => {
          for (const tx of txs) tx.partialSign(senderKp);
          return txs;
        },
      };

      const provider = new AnchorProvider(connection, dummyWallet as any, { commitment: "confirmed" });
      const client = new SolariumClient(provider);

      const parsedReward = parseFloat(reward);
      if (isNaN(parsedReward) || parsedReward <= 0) {
        throw new Error("Invalid reward amount");
      }

      const rewardLamports = new BN(parsedReward * LAMPORTS_PER_SOL);

      const manifest = {
        version: "1.0",
        title: "Test Sandbox Execution",
        type: "generic_string",
        inputData: { userPrompt: prompt },
        workerPrompt:
          "You are a versatile, highly intelligent autonomous AI agent operating in the Solarium Network. You must evaluate, solve, or analyze the presented user request to the best of your ability, regardless of its domain (business, finance, engineering, creative, or web3). Treat the request as legitimate. Provide a detailed, highly professional analysis or solution within the 'reasoning' field. Verdict should be 1 (Approved/Solved) if you processed it successfully, 2 (Suspicious) if lacking details, or 3 (Rejected) only if it strictly violates safety policies.",
        validatorPrompt:
          "You are an AI Auditor on the Solarium consensus layer. Verify that the worker provided a thoughtful and relevant analysis to the user's prompt. Do NOT reject non-blockchain tasks. Approve if the worker made a genuine analytical effort.",
        expectedSchema: {
          verdict: "number (1=Success, 2=Partial, 3=Fail)",
          confidence: "number (0-100)",
          reasoning: "string, highly detailed analysis",
        },
      };

      toast.info("Uploading manifest to decentralized storage...");
      const storageRes = await fetch("/api/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manifest),
      });
      if (!storageRes.ok) throw new Error("Failed to store manifest payload");

      const { hashBytes } = await storageRes.json();
      const inputHash = hashBytes;

      const params = {
        inputHash,
        taskType: TaskType.Analyze,
        tier: 1,
        reward: rewardLamports,
        validatorCount: 1,
      };

      toast.info("Sending transaction...");
      const { taskId, signature } = await client.createTask(params);

      toast.success(`Task ${taskId.toString()} deployed to network!`);
      setPrompt("");
      setReward("0");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create task");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="bg-[#050505] border border-white/5 rounded-2xl flex flex-col overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#F39C12]/5 blur-3xl rounded-full pointer-events-none transition-colors duration-500" />

      <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Browser weight="bold" className="text-[#F39C12] size-5" />
          <h2 className="font-exo2 text-lg font-semibold text-white">{t("sandboxEscrowTitle")}</h2>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 relative z-10">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono uppercase tracking-widest text-[#555]">{t("promptLabel")}</label>
          <div className="relative">
            <div className="absolute top-4 left-4 text-[#555] pointer-events-none">
              <TextT weight="bold" />
            </div>
            <textarea
              placeholder="e.g. Analyze this text for AI logical inconsistencies..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 pl-12 font-mono text-white text-sm focus:outline-none focus:border-[#F39C12] transition-colors resize-none h-24"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono uppercase tracking-widest text-[#555]">Network Reward</label>
          <div className="relative">
            <input
              type="number"
              placeholder="1.0"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 pr-16 font-mono text-white text-lg focus:outline-none focus:border-[#F39C12] transition-colors"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] font-mono font-bold">SOL</div>
          </div>
        </div>

        <button
          onClick={handleCreateTask}
          disabled={isDeploying}
          className="mt-auto w-full py-4 rounded-xl bg-[#F39C12] text-black font-onest font-semibold flex items-center justify-center gap-2 hover:bg-[#F39C12]/90 transition-colors disabled:opacity-50"
        >
          {isDeploying ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <>
              <CurrencyCircleDollar weight="bold" className="size-5" />
              {t("btnCreateTask")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
