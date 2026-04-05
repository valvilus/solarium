import { useState } from "react";
import { useTranslations } from "next-intl";
import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { SolariumClient, NodeType } from "@solarium-labs/sdk";
import bs58 from "bs58";
import { toast } from "sonner";
import { useNetwork } from "@/providers/wallet-provider";
import { Cpu, Lightning, Play, ShieldCheck, Key } from "@phosphor-icons/react";
import { BN, AnchorProvider } from "@coral-xyz/anchor";

export function NetworkBootstrapper() {
  const t = useTranslations("Explorer");
  const { connection } = useConnection();
  const { network } = useNetwork();

  const [role, setRole] = useState<"worker" | "validator">("worker");
  const [apiKey, setApiKey] = useState("AIzaSyDM7BGbljdqfe0AqwynjZyqQZKdn7R63dk");
  const [isDeploying, setIsDeploying] = useState(false);
  const [devnetSpawnCount, setDevnetSpawnCount] = useState(0);

  const handleSpawnBot = async () => {
    if (!apiKey) {
      toast.error(t("apiKeyRequired"));
      return;
    }

    if (network === "devnet" && devnetSpawnCount >= 2) {
      toast.error("Devnet Pool Exhausted (Max 2 nodes for Demo). Use Localnet for unlimited proxy bots.");
      return;
    }

    setIsDeploying(true);
    try {
      const operatorKp = Keypair.generate();

      const burnerKp = Keypair.generate();

      if (network === "devnet") {
        toast.success("Using Bot Pool Immortal keys for Devnet. Spawning Docker...");
      } else {
        toast.info(`Generated Operator: ${operatorKp.publicKey.toString().substring(0, 8)}... Requesting Airdrop`);

        const sig1 = await connection.requestAirdrop(operatorKp.publicKey, 10 * LAMPORTS_PER_SOL);
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction(
          {
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: sig1,
          },
          "confirmed"
        );

        toast.success("Airdrop received. Registering Node...");

        const dummyWallet = {
          publicKey: operatorKp.publicKey,
          signTransaction: async (tx: any) => {
            tx.partialSign(operatorKp);
            return tx;
          },
          signAllTransactions: async (txs: any[]) => {
            for (const tx of txs) tx.partialSign(operatorKp);
            return txs;
          },
        };

        const provider = new AnchorProvider(connection, dummyWallet as any, { commitment: "confirmed" });
        const client = new SolariumClient(provider);

        const nodeType = role === "worker" ? NodeType.Worker : NodeType.Validator;

        await client.registerNode(burnerKp.publicKey, nodeType, 1);

        await client.depositStake(new BN(5 * LAMPORTS_PER_SOL));

        toast.success("Registered on Solarium Protocol. Spawning Docker...");
      }

      const burnerSecret = bs58.encode(burnerKp.secretKey);

      const response = await fetch("/api/nodes/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pubkey: operatorKp.publicKey.toString(),
          apiKey,
          burnerSecret: JSON.stringify(Array.from(burnerKp.secretKey)),
          burnerPubkey: burnerKp.publicKey.toString(),
          role,
          network,
        }),
      });

      if (!response.ok) throw new Error("Docker start failed");

      localStorage.setItem(`solarium_bot_${operatorKp.publicKey.toString()}_${role}`, burnerSecret);

      if (network === "devnet") {
        setDevnetSpawnCount((prev) => prev + 1);
      }

      toast.success(t("statusSuccess") + " " + operatorKp.publicKey.toString().substring(0, 8));

      setApiKey("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to spawn infrastructure bot");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10D9B0]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-6">
        <Cpu weight="fill" className="text-[#10D9B0] size-6" />
        <h2 className="font-exo2 text-xl font-bold text-white">{t("sandboxTitle")}</h2>
      </div>

      <p className="text-[#888] font-mono text-sm leading-relaxed mb-6">{t("bootstrapperDesc")}</p>

      <div className="flex flex-col gap-5">
        <div className="flex bg-[#0A0A0A] border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => setRole("worker")}
            className={`flex-1 py-3 text-sm font-mono uppercase tracking-wider rounded-lg transition-all ${role === "worker" ? "bg-white/10 text-white" : "text-[#555] hover:text-white"}`}
          >
            Worker
          </button>
          <button
            onClick={() => setRole("validator")}
            className={`flex-1 py-3 text-sm font-mono uppercase tracking-wider rounded-lg transition-all ${role === "validator" ? "bg-white/10 text-white" : "text-[#555] hover:text-white"}`}
          >
            Validator
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Key weight="bold" className="text-[#555]" />
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={t("apiKeyRequired")}
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 pl-12 font-mono text-white text-sm focus:outline-none focus:border-[#10D9B0] transition-colors shadow-inner"
          />
        </div>

        <button
          onClick={handleSpawnBot}
          disabled={isDeploying || !apiKey || (network === "devnet" && devnetSpawnCount >= 2)}
          className="w-full py-4 rounded-xl bg-[#10D9B0] text-black font-onest font-bold flex items-center justify-center gap-2 hover:bg-[#10D9B0]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative"
        >
          {network === "devnet" && devnetSpawnCount >= 2 && (
            <div className="absolute -top-10 bg-red-500/20 text-red-400 border border-red-500/50 text-xs px-3 py-1 rounded-full whitespace-nowrap">
              Devnet Pool Limit (2/2) Reached
            </div>
          )}
          {isDeploying ? (
            <span className="flex items-center gap-2 animate-pulse">
              <Cpu weight="bold" className="size-5" />
              {t("statusDeploying")}
            </span>
          ) : (
            <span className="flex items-center gap-2 group-hover:scale-105 transition-transform">
              {role === "worker" ? (
                <Lightning weight="bold" className="size-5" />
              ) : (
                <ShieldCheck weight="bold" className="size-5" />
              )}
              {t("btnDeployProxy")}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
