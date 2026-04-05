"use client";

import { useTranslations } from "next-intl";
import { Drop, WarningCircle, CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNetwork } from "@/providers/wallet-provider";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";

export function FaucetWidget({ onAirdropSuccess }: { onAirdropSuccess?: () => void }) {
  const t = useTranslations("DashboardFaucet");
  const { publicKey } = useWallet();
  const { network, rpcUrl } = useNetwork();

  const [isRequesting, setIsRequesting] = useState(false);

  const isMainnet = (network as string) === "mainnet";

  const requestAirdrop = async () => {
    if (!publicKey) {
      toast.error(t("walletNotConnected"));
      return;
    }

    if (isMainnet) {
      toast.error(t("networkMismatchDesc"));
      return;
    }

    try {
      setIsRequesting(true);
      toast.loading(t("requesting"), { id: "airdrop" });

      const connection = new Connection(rpcUrl, "confirmed");
      const amount = network === "devnet" ? 1 : 2;

      const signature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);

      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature,
        ...latestBlockhash,
      });

      toast.success(t("successMessage", { amount }), { id: "airdrop" });
      if (onAirdropSuccess) {
        onAirdropSuccess();
      }
    } catch (error) {
      console.error("Airdrop failed:", error);
      toast.error(t("errorMessage"), { id: "airdrop" });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl flex flex-col overflow-hidden relative group w-full h-full min-h-[400px]">
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#10D9B0]/5 blur-3xl rounded-full pointer-events-none transition-colors" />

      <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Drop weight="fill" className="text-[#10D9B0] size-6" />
          <h2 className="font-exo2 text-xl font-semibold text-white">{t("title")}</h2>
        </div>
        <p className="text-[#777] text-sm mt-2">{t("description")}</p>
      </div>

      <div className="p-8 flex-1 flex flex-col gap-6 relative z-10">
        <div className="flex flex-col gap-1 mb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#555]">Active Network</span>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 w-fit ${network === "localnet" ? "bg-[#10D9B0]/10 text-[#10D9B0]" : network === "devnet" ? "bg-[#F39C12]/10 text-[#F39C12]" : "bg-[#FF1515]/10 text-[#FF1515]"}`}
          >
            <div className="w-2 h-2 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
            <span className="font-mono text-[12px] font-bold tracking-widest uppercase">{network}</span>
          </div>
        </div>

        {isMainnet ? (
          <div className="flex bg-[#FF1515]/10 border border-[#FF1515]/20 p-4 rounded-xl items-start gap-3 text-[#FF1515]">
            <WarningCircle weight="fill" className="size-5 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold text-sm tracking-wide">{t("networkMismatchTitle")}</span>
              <span className="text-xs font-onest text-[#FF1515]/80 leading-relaxed">{t("networkMismatchDesc")}</span>
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <button
            onClick={requestAirdrop}
            disabled={isRequesting || isMainnet || !publicKey}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-onest font-semibold transition-all ${
              isRequesting || isMainnet || !publicKey
                ? "bg-white/5 text-[#555] cursor-not-allowed border border-white/5"
                : "bg-[#10D9B0]/10 text-[#10D9B0] hover:bg-[#10D9B0] hover:text-black border border-[#10D9B0]/20 hover:border-[#10D9B0] cursor-pointer"
            }`}
          >
            {isRequesting ? (
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Drop weight="bold" className="size-5" />
            )}
            {isRequesting ? t("requesting") : t("requestAirdrop")}
          </button>
        </div>
      </div>
    </div>
  );
}
