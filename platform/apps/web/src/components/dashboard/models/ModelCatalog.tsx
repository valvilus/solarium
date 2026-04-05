"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, Brain, Target, ShieldCheck, HardDrives } from "@phosphor-icons/react";
import { useState } from "react";
import { ModelConfigForm } from "./ModelConfigForm";

export function ModelCatalog() {
  const t = useTranslations("DashboardModels");
  const [activeTab, setActiveTab] = useState<"gemini" | "openai" | null>("gemini");

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab("gemini")}
          className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
            activeTab === "gemini"
              ? "bg-[#0A0A0A] border-[#10D9B0]/50 shadow-[0_0_30px_rgba(16,217,176,0.05)]"
              : "bg-[#050505] border-white/5 hover:border-white/20"
          }`}
        >
          {activeTab === "gemini" && (
            <div className="absolute top-0 right-0 p-4">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#10D9B0]/10 text-[#10D9B0] text-[10px] font-mono uppercase tracking-widest">
                <CheckCircle weight="fill" /> {t("activeProvider")}
              </span>
            </div>
          )}

          <div
            className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center transition-colors ${
              activeTab === "gemini"
                ? "bg-[#10D9B0]/10 text-[#10D9B0]"
                : "bg-white/5 text-white/50 group-hover:text-white"
            }`}
          >
            <Brain weight="fill" className="size-6" />
          </div>

          <h3 className="text-xl font-exo2 font-bold text-white mb-2">{t("gemini")}</h3>
          <p className="text-sm font-onest text-[#777] leading-relaxed">{t("geminiDesc")}</p>
        </div>

        <div className="bg-[#050505] border border-white/5 p-6 rounded-2xl relative overflow-hidden opacity-50">
          <div className="absolute top-0 right-0 p-4">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-[#555] text-[10px] font-mono uppercase tracking-widest">
              {t("comingSoon")}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 text-white/20 mb-6 flex items-center justify-center">
            <Target weight="fill" className="size-6" />
          </div>
          <h3 className="text-xl font-exo2 font-bold text-white mb-2">{t("openai")}</h3>
          <p className="text-sm font-onest text-[#777] leading-relaxed">{t("openaiDesc")}</p>
        </div>

        <div className="bg-[#050505] border border-white/5 p-6 rounded-2xl relative overflow-hidden opacity-50">
          <div className="absolute top-0 right-0 p-4">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-[#555] text-[10px] font-mono uppercase tracking-widest">
              {t("comingSoon")}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/5 text-white/20 mb-6 flex items-center justify-center">
            <ShieldCheck weight="fill" className="size-6" />
          </div>
          <h3 className="text-xl font-exo2 font-bold text-white mb-2">{t("anthropic")}</h3>
          <p className="text-sm font-onest text-[#777] leading-relaxed">{t("claudeDesc")}</p>
        </div>

        <div className="bg-[#050505] border border-[#F39C12]/10 p-6 rounded-2xl relative overflow-hidden opacity-50">
          <div className="absolute top-0 right-0 p-4">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#F39C12]/10 text-[#F39C12] text-[10px] font-mono uppercase tracking-widest">
              {t("comingSoon")}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F39C12]/5 text-[#F39C12]/50 mb-6 flex items-center justify-center">
            <HardDrives weight="fill" className="size-6" />
          </div>
          <h3 className="text-xl font-exo2 font-bold text-white mb-2">{t("llama")}</h3>
          <p className="text-sm font-onest text-[#777] leading-relaxed">{t("llamaDesc")}</p>
        </div>
      </div>

      {activeTab === "gemini" && <ModelConfigForm />}
    </div>
  );
}
