"use client";

import { useState } from "react";
import { Vault, CurrencyCircleDollar, ArrowsLeftRight } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

export function EscrowWidget() {
  const t = useTranslations("DashboardApi");
  const [depositAmount, setDepositAmount] = useState("");

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl flex flex-col overflow-hidden h-full relative group">
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#4895EF]/5 blur-3xl rounded-full pointer-events-none group-hover:bg-[#4895EF]/10 transition-colors duration-500" />

      <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Vault weight="fill" className="text-white size-5" />
          <h2 className="font-exo2 text-lg font-semibold text-white">{t("escrowTitle")}</h2>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6 relative z-10">
        <div className="flex flex-col gap-1 mb-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[#777]">{t("escrowBalance")}</span>
          <div className="flex items-baseline gap-2">
            <span className="font-exo2 text-3xl font-bold text-white">0.00</span>
            <span className="font-mono text-sm text-[#555]">SOL</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono uppercase tracking-widest text-[#555]">{t("topUpEscrow")}</label>
          <div className="relative">
            <input
              type="number"
              placeholder="5.0"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-4 pr-16 font-mono text-white text-lg focus:outline-none focus:border-[#4895EF] transition-colors"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] font-mono font-bold">SOL</div>
          </div>
        </div>

        <button className="mt-auto w-full py-4 rounded-xl bg-white text-black font-onest font-semibold flex items-center justify-center gap-2 hover:bg-[#E2E8F0] transition-colors">
          <CurrencyCircleDollar weight="bold" className="size-5" />
          {t("btnDeposit")}
        </button>
      </div>
    </div>
  );
}
