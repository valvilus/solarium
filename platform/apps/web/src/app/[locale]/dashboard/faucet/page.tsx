"use client";

import { useTranslations } from "next-intl";
import { FaucetWidget } from "@/components/dashboard/faucet/FaucetWidget";
import { Wallet, Info, TrendUp, ShieldCheck, Cpu } from "@phosphor-icons/react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function FaucetPage() {
  const t = useTranslations("DashboardFaucet");
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | null>(null);

  const fetchBalance = async () => {
    if (!publicKey) return;
    try {
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (e) {}
  };

  useEffect(() => {
    fetchBalance();
    const id = setInterval(fetchBalance, 5000);
    return () => clearInterval(id);
  }, [publicKey, connection]);

  return (
    <div className="w-full flex-col animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2 mb-8 border-b border-white/5 pb-8">
        <h1 className="text-3xl font-exo2 font-semibold text-white tracking-tight">{t("title")}</h1>
        <span className="text-[#777] font-onest">{t("description")}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
        <div className="xl:col-span-7 flex flex-col gap-6">
          <FaucetWidget onAirdropSuccess={fetchBalance} />
        </div>

        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-[#030303] border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 blur-3xl rounded-full pointer-events-none" />
            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4 relative z-10">
              <span className="font-mono text-xs text-[#555] uppercase tracking-widest">{t("walletState")}</span>
              <Wallet weight="fill" className="text-[#8B5CF6] size-5" />
            </div>
            <div className="relative z-10">
              <span className="block text-4xl font-exo2 text-white font-bold tracking-tight mb-2">
                {balance !== null ? `${balance.toFixed(2)} SOL` : "0.00 SOL"}
              </span>
              <span className="text-[12px] font-mono text-[#555] bg-white/5 px-2 py-0.5 rounded border border-white/5 flex items-center w-fit gap-1 mt-2">
                {publicKey ? t("connected") : t("disconnected")}
              </span>
            </div>
          </div>

          <div className="bg-[#050505] border border-white/5 rounded-2xl flex flex-col relative overflow-hidden flex-1 shadow-2xl">
            <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Info weight="bold" className="text-[#10D9B0] size-4" />
                <h3 className="font-exo2 text-sm text-white font-bold uppercase tracking-wider">{t("reqTitle")}</h3>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-6 flex-1">
              <div className="flex gap-4 items-start group">
                <div className="p-2.5 rounded-lg bg-[#4895EF]/5 border border-[#4895EF]/20 group-hover:bg-[#4895EF]/10 transition-colors mt-1 shrink-0">
                  <ShieldCheck weight="fill" className="text-[#4895EF] size-5" />
                </div>
                <div>
                  <span className="block text-white font-bold text-sm mb-1">{t("valTitle")}</span>
                  <span className="block text-[#777] text-[13px] font-onest leading-relaxed">
                    {t.rich("valDesc", {
                      amount: (chunks) => <span className="text-white">{chunks}</span>,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="p-2.5 rounded-lg bg-[#10D9B0]/5 border border-[#10D9B0]/20 group-hover:bg-[#10D9B0]/10 transition-colors mt-1 shrink-0">
                  <Cpu weight="fill" className="text-[#10D9B0] size-5" />
                </div>
                <div>
                  <span className="block text-white font-bold text-sm mb-1">{t("workerTitle")}</span>
                  <span className="block text-[#777] text-[13px] font-onest leading-relaxed">
                    {t.rich("workerDesc", {
                      amount: (chunks) => <span className="text-white">{chunks}</span>,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="p-2.5 rounded-lg bg-[#F39C12]/5 border border-[#F39C12]/20 group-hover:bg-[#F39C12]/10 transition-colors mt-1 shrink-0">
                  <TrendUp weight="fill" className="text-[#F39C12] size-5" />
                </div>
                <div>
                  <span className="block text-white font-bold text-sm mb-1">{t("sandboxTitle")}</span>
                  <span className="block text-[#777] text-[13px] font-onest leading-relaxed">
                    {t.rich("sandboxDesc", {
                      amount: (chunks) => <span className="text-white">{chunks}</span>,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
