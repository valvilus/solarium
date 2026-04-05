"use client";

import { useTranslations } from "next-intl";
import { TutorialNode } from "./TutorialNode";
import { useState } from "react";

export function Step10ResolutionNode({ onNext }: { onNext?: () => void }) {
  const t = useTranslations("StudyModePage.step10");
  const [scenario, setScenario] = useState<"success" | "slash">("success");

  return (
    <div
      className={`w-[1000px] shrink-0 bg-[#050505]/95 border ${scenario === "success" ? "border-[#10D9B0]/40 shadow-[0_0_30px_rgba(16,217,176,0.15)]" : "border-[#F43F5E]/40 shadow-[0_0_30px_rgba(244,63,94,0.15)]"} rounded-xl backdrop-blur-xl flex flex-col relative overflow-hidden transition-all duration-700`}
    >
      <div className="px-5 py-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-widest leading-none ${scenario === "success" ? "bg-[#10D9B0]/10 border-[#10D9B0]/20 text-[#10D9B0]" : "bg-[#F43F5E]/10 border-[#F43F5E]/20 text-[#F43F5E]"} border`}
            >
              {t("role")}
            </span>
          </div>

          <div className="flex bg-[#111] border border-white/10 rounded-lg p-1 gap-1">
            <button
              onClick={() => setScenario("success")}
              className={`px-4 py-2 rounded-md text-[11px] font-unbounded transition-all ${scenario === "success" ? "bg-[#10D9B0]/20 text-[#10D9B0] shadow-sm" : "text-[#666] hover:text-white"}`}
            >
              {t("tabSuccess")}
            </button>
            <button
              onClick={() => setScenario("slash")}
              className={`px-4 py-2 rounded-md text-[11px] font-unbounded transition-all ${scenario === "slash" ? "bg-[#F43F5E]/20 text-[#F43F5E] shadow-sm" : "text-[#666] hover:text-white"}`}
            >
              {t("tabSlash")}
            </button>
          </div>
        </div>

        <h3 className="font-unbounded font-medium text-white text-xl">{t("title")}</h3>
        <p className="text-[#A0A0A0] font-onest text-[14px] mt-2.5 leading-relaxed overflow-hidden transition-all">
          {t("description")}
        </p>
      </div>

      <div className="p-5 flex flex-col gap-6 relative">
        <div
          className={`p-5 rounded-lg border transition-all duration-500 ${scenario === "success" ? "bg-[#10D9B0]/5 border-[#10D9B0]/20" : "bg-[#F43F5E]/5 border-[#F43F5E]/20"}`}
        >
          <p className="text-white/80 text-[13px] font-onest leading-relaxed">
            {scenario === "success" ? t("successText") : t("slashText")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-xl block relative overflow-hidden shadow-inner">
            <h4 className="text-white font-unbounded text-sm mb-5 flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 397 311"
                fill="currentColor"
                className={scenario === "success" ? "text-yellow-500" : "text-[#F43F5E]"}
              >
                <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
                <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
                <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
              </svg>
              {scenario === "success" ? t("rewardDistTitle") : t("slashDistTitle")}
            </h4>

            {scenario === "success" ? (
              <div className="flex flex-col gap-3 font-mono text-[11px] animate-in slide-in-from-left-4 fade-in duration-500">
                <div className="flex justify-between items-center p-3 bg-[#FFB703]/10 border border-[#FFB703]/20 rounded-lg">
                  <span className="text-[#A0A0A0]">Worker Node</span>
                  <span className="text-[#FFB703] font-bold">+ 0.90 SOL (60%)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-lg">
                  <span className="text-[#A0A0A0]">Validator Cluster</span>
                  <span className="text-[#38BDF8] font-bold">+ 0.525 SOL (35%)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-[#A0A0A0]">Protocol Treasury</span>
                  <span className="text-white font-bold">+ 0.075 SOL (5%)</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 font-mono text-[11px] animate-in slide-in-from-right-4 fade-in duration-500">
                <div className="flex justify-between items-center p-4 bg-[#F43F5E]/10 border border-[#F43F5E]/30 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#F43F5E]/20 animate-pulse pointer-events-none" />
                  <span className="text-[#F43F5E] relative z-10 font-bold uppercase tracking-widest">
                    Malicious Worker
                  </span>
                  <span className="text-[#F43F5E] relative z-10 font-bold text-sm">- 0.05 SOL (-5%)</span>
                </div>

                <div className="flex justify-between items-center p-3 px-4 bg-white/5 border border-white/10 rounded-lg opacity-50">
                  <span className="text-[#A0A0A0]">Validator Cluster</span>
                  <span className="text-white">Reputation Maintained</span>
                </div>

                <div className="flex justify-between items-center p-3 px-4 bg-white/5 border border-white/10 rounded-lg">
                  <span className="text-[#A0A0A0]">User Refund</span>
                  <span className="text-white font-bold">+ 1.50 SOL (100%)</span>
                </div>
              </div>
            )}
          </div>

          <div
            className={`bg-[#050505] border ${scenario === "success" ? "border-[#10D9B0]/30 shadow-[0_0_20px_rgba(16,217,176,0.1)]" : "border-[#F43F5E]/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]"} p-5 rounded-xl flex flex-col justify-between relative overflow-hidden transition-all duration-700`}
          >
            <h4 className="text-white font-unbounded text-sm mb-4 relative z-10 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H120v45.1l36.63-26.46a8,8,0,1,1,9.4,12.92l-48.49,35.05h-.11a8,8,0,0,1-9.76,0L60.08,167.56a8,8,0,1,1,9.39-12.92L104,181.1V136H40a8,8,0,0,1,0-16h64V74.9L67.37,101.36a8,8,0,1,1-9.4-12.92l48.49-35.05h.11a8,8,0,0,1,9.76,0l48.59,35.05a8,8,0,1,1-9.39,12.92L120,74.9v45.1h96A8,8,0,0,1,224,128Z"></path>
              </svg>
              {t("dappReturnTitle")}
            </h4>

            <div className="flex-1 flex flex-col justify-center relative">
              {scenario === "success" ? (
                <div className="flex flex-col gap-4 animate-in zoom-in-95 duration-500">
                  <div className="flex items-start gap-4 p-4 border border-[#10D9B0]/20 bg-[#10D9B0]/5 rounded-lg">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#10D9B0]/20 flex items-center justify-center">
                      <span className="text-[#10D9B0] font-bold">✓</span>
                    </div>
                    <div>
                      <span className="block text-[#10D9B0] text-[13px] font-bold mb-1">DApp Oracle Update</span>
                      <span className="block text-[#A0A0A0] text-[12px] font-mono leading-relaxed">
                        Cross-program Invocation (CPI) triggers User's DeFi Swap. Tokens safely exchanged.
                      </span>
                    </div>
                  </div>
                  <div className="opacity-80 pl-6 border-l-2 border-[#10D9B0]/20 ml-6 flex flex-col gap-2">
                    <span className="text-[#10D9B0] text-[10px] uppercase tracking-widest font-mono">
                      Transaction Log
                    </span>
                    <span className="text-white text-[11px] font-mono bg-[#111] border border-white/5 p-2 rounded">
                      {"[tx] swap(1.5 SOL -> 65 USDC) => CONFIRMED"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 animate-in zoom-in-95 duration-500">
                  <div className="flex items-start gap-4 p-4 border border-[#F43F5E]/20 bg-[#F43F5E]/5 rounded-lg">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#F43F5E]/20 flex items-center justify-center">
                      <span className="text-[#F43F5E] font-bold">×</span>
                    </div>
                    <div>
                      <span className="block text-[#F43F5E] text-[13px] font-bold mb-1">DApp Transaction Blocked</span>
                      <span className="block text-[#A0A0A0] text-[12px] font-mono leading-relaxed">
                        Malicious parameters detected. Smart contract aborts swap. User funds remain 100% safe.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`px-5 py-4 bg-white/[0.02] border-t border-white/5`}>
        <div className="flex items-center justify-between">
          <span className="text-[#888] font-onest text-[13px] flex items-center gap-2">
            {scenario === "success" ? (
              <>
                <div className="w-1.5 h-1.5 bg-[#10D9B0] rounded-full shadow-[0_0_8px_#10D9B0]" />
                End-to-end trustless AI layer.
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 bg-[#F43F5E] rounded-full shadow-[0_0_8px_#F43F5E]" />
                Cryptoeconomic security at work.
              </>
            )}
          </span>
          <button
            onClick={onNext}
            className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-lg font-unbounded text-[12px] font-medium tracking-wider uppercase transition-all duration-300"
          >
            {t("btnFinish")}
          </button>
        </div>
      </div>
    </div>
  );
}
