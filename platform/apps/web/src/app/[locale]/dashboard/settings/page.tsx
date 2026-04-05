"use client";

import { useTranslations } from "next-intl";
import { useNetwork } from "@/providers/wallet-provider";
import { Globe, Plug, Link as LinkIcon, Database } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const t = useTranslations("DashboardSettings");
  const { network } = useNetwork();

  const [rpcUrl, setRpcUrl] = useState("http://127.0.0.1:8899");
  const [explorer, setExplorer] = useState("solscan");

  const saveSettings = () => {
    toast.success("Settings saved locally");
  };

  return (
    <div className="w-full flex-col animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2 mb-8 border-b border-white/5 pb-8">
        <h1 className="text-3xl font-exo2 font-semibold text-white tracking-tight">{t("title")}</h1>
        <span className="text-[#777] font-onest">{t("description")}</span>
      </div>

      <div className="max-w-3xl flex flex-col gap-8">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
            <Plug weight="fill" className="text-[#10D9B0] size-5" />
            <h2 className="font-exo2 font-semibold text-white">{t("rpcTitle")}</h2>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <span className="font-onest text-sm text-[#777]">{t("rpcDesc")}</span>

            <div className="flex gap-4 items-center">
              <input
                type="text"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                className="flex-1 bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#10D9B0] transition-colors"
              />
              <button
                className="px-6 py-3 bg-[#10D9B0]/10 text-[#10D9B0] hover:bg-[#10D9B0] hover:text-black font-semibold rounded-lg transition-colors border border-[#10D9B0]/20"
                onClick={saveSettings}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
            <Globe weight="fill" className="text-[#4895EF] size-5" />
            <h2 className="font-exo2 font-semibold text-white">{t("explorerTitle")}</h2>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <span className="font-onest text-sm text-[#777]">{t("explorerDesc")}</span>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setExplorer("solscan")}
                className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${explorer === "solscan" ? "bg-[#4895EF]/10 border-[#4895EF]/40 text-white" : "bg-white/[0.02] border-white/5 text-[#777] hover:bg-white/5"}`}
              >
                <img src="https://solscan.io/favicon.ico" alt="Solscan" className="w-5 h-5 rounded-full" />
                <span className="font-exo2 font-semibold">Solscan</span>
              </button>

              <button
                onClick={() => setExplorer("solanafm")}
                className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${explorer === "solanafm" ? "bg-[#4895EF]/10 border-[#4895EF]/40 text-white" : "bg-white/[0.02] border-white/5 text-[#777] hover:bg-white/5"}`}
              >
                <div className="bg-white p-1 rounded-full">
                  <Database weight="fill" className="text-black size-3" />
                </div>
                <span className="font-exo2 font-semibold">SolanaFM</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
