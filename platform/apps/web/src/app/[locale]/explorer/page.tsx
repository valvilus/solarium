"use client";

import { useTranslations } from "next-intl";
import { MagnifyingGlass, WifiHigh } from "@phosphor-icons/react";
import { useNetwork } from "@/providers/wallet-provider";
import { NetworkMetrics } from "@/components/explorer/NetworkMetrics";
import { LiveTaskFeed } from "@/components/explorer/LiveTaskFeed";
import { NetworkBootstrapper } from "@/components/explorer/NetworkBootstrapper";
import { NodeRoster } from "@/components/explorer/NodeRoster";
import { SandboxEscrowWidget } from "@/components/explorer/SandboxEscrowWidget";

export default function ExplorerPage() {
  const t = useTranslations("Explorer");
  const { network, setNetwork } = useNetwork();

  return (
    <div className="w-full flex-col animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col items-center text-center justify-center pt-8 pb-12">
        <span className="font-mono text-[#8BA3C0] uppercase tracking-[0.2em] text-xs mb-4">{t("subtitle")}</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-exo2 font-bold text-white mb-8 tracking-tight">
          {t("title")}
        </h1>

        <div className="flex items-center gap-2 mb-10 bg-[#0A0A0A] p-1.5 rounded-full border border-white/10">
          <button
            onClick={() => setNetwork("localnet")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all ${network === "localnet" ? "bg-[#10D9B0]/20 text-[#10D9B0] shadow-[0_0_15px_rgba(16,217,176,0.2)]" : "text-[#555] hover:text-white"}`}
          >
            <WifiHigh weight={network === "localnet" ? "bold" : "regular"} /> Localnet
          </button>
          <button
            onClick={() => setNetwork("devnet")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all ${network === "devnet" ? "bg-[#F39C12]/20 text-[#F39C12] shadow-[0_0_15px_rgba(243,156,18,0.2)]" : "text-[#555] hover:text-white"}`}
          >
            <WifiHigh weight={network === "devnet" ? "bold" : "regular"} /> Devnet (Live)
          </button>
        </div>

        <div className="w-full max-w-2xl relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <MagnifyingGlass
              weight="bold"
              className="text-[#555] group-focus-within:text-[#10D9B0] transition-colors size-5"
            />
          </div>
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-full py-5 pl-16 pr-6 text-white font-mono placeholder:text-[#555] focus:outline-none focus:border-[#10D9B0]/50 focus:ring-1 focus:ring-[#10D9B0]/50 transition-all shadow-xl"
          />
        </div>
      </div>

      <div className="mb-12">
        <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-4 ml-1">{t("networkMetrics")}</h3>
        <NetworkMetrics />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-12 items-start">
        <div className="xl:col-span-4 flex flex-col gap-6">
          <NetworkBootstrapper />
          <SandboxEscrowWidget />
        </div>

        <div className="xl:col-span-8 flex flex-col gap-6">
          <NodeRoster />
          <LiveTaskFeed />
        </div>
      </div>
    </div>
  );
}
