"use client";

import { useTranslations } from "next-intl";
import { TutorialNode } from "./TutorialNode";
import { useState, useEffect } from "react";

export function Step7ClaimNode({ onNext }: { onNext: () => void }) {
  const t = useTranslations("StudyModePage.step7");
  const [stage, setStage] = useState(0);
  const [polls, setPolls] = useState<number[]>([]);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      setPolls((prev) => [...prev, Date.now()].slice(-6));
    }, 400);

    const timer1 = setTimeout(() => {
      clearInterval(pollInterval);
      setStage(1);
    }, 2800);

    const timer2 = setTimeout(() => {
      setStage(2);
    }, 4500);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div
      className={`w-[1000px] shrink-0 bg-[#050505]/95 border border-[#F43F5E]/40 shadow-[0_0_30px_rgba(244,63,94,0.1)] rounded-xl backdrop-blur-xl flex flex-col relative overflow-hidden transition-all duration-500`}
    >
      <div className="px-5 py-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded bg-[#F43F5E]/10 border border-[#F43F5E]/20 text-[#F43F5E] text-[10px] font-mono uppercase tracking-widest leading-none">
            {t("role")}
          </span>
        </div>
        <h3 className="font-unbounded font-medium text-white text-xl">{t("title")}</h3>
        <p className="text-[#A0A0A0] font-onest text-[14px] mt-2.5 leading-relaxed">{t("description")}</p>
      </div>

      <div className="p-5 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-[#F43F5E]/5 border border-[#F43F5E]/10 rounded-lg p-5">
            <p className="text-[#F43F5E]/90 text-[13px] font-onest leading-relaxed">{t("longText1")}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5">
            <p className="text-white/60 text-[13px] font-onest leading-relaxed">{t("longText2")}</p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-xl block relative overflow-hidden shadow-inner">
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-white font-unbounded text-sm">{t("rpcTitle")}</h4>
              <div className="flex gap-1.5 items-center">
                <span className="text-[10px] text-[#A0A0A0] uppercase font-mono">Status:</span>
                {stage === 0 ? (
                  <span className="text-[10px] text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 animate-pulse">
                    Scanning...
                  </span>
                ) : (
                  <span className="text-[10px] text-[#F43F5E] uppercase tracking-widest bg-[#F43F5E]/10 px-2 py-0.5 rounded border border-[#F43F5E]/20">
                    Target Locked
                  </span>
                )}
              </div>
            </div>

            <div className="bg-[#050505] p-4 rounded-lg border border-white/5 font-mono text-[11px] leading-relaxed relative min-h-[160px] flex flex-col justify-end">
              {stage === 0 &&
                polls.map((ts, i) => (
                  <div
                    key={ts}
                    className={`flex gap-3 transition-opacity duration-300 ${i === polls.length - 1 ? "opacity-100 text-white" : "opacity-40 text-[#666]"}`}
                  >
                    <span className="text-[#888]">[RPC]</span>
                    <span className="text-blue-400">getProgramAccounts</span>
                    <span className="text-yellow-500/60">filters: [&#123;status: OPEN&#125;]</span>
                    <span className="text-[#A0A0A0]">➔ response: [] (empty)</span>
                  </div>
                ))}

              {stage >= 1 && (
                <div className="flex flex-col gap-2 mt-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <div className="flex gap-3 text-white">
                    <span className="text-[#888]">[RPC]</span>
                    <span className="text-blue-400">getProgramAccounts</span>
                    <span className="text-yellow-500/60">filters: [&#123;status: OPEN&#125;]</span>
                    <span className="text-[#10D9B0] glow">➔ response: [1 match]</span>
                  </div>
                  <div className="border border-[#10D9B0]/30 bg-[#10D9B0]/5 rounded p-2 ml-10">
                    <span className="block text-[#10D9B0] mb-1">TASK FOUND! PDA: 8xKf...9Tqy</span>
                    <span className="block text-[#A0A0A0]">Action: Initiating anchor.rpc.claimTask()</span>
                  </div>
                  {stage >= 2 && (
                    <div className="flex gap-3 text-white mt-1 animate-in fade-in duration-300">
                      <span className="text-[#888]">[SIGNER]</span>
                      <span className="text-[#F43F5E] font-bold">Claim Tx Confirmed! sig: 5abc...1xyz</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            className={`bg-[#050505] border ${stage >= 2 ? "border-[#F43F5E]/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]" : "border-white/5"} p-5 rounded-xl flex flex-col relative overflow-hidden transition-all duration-700`}
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-white font-unbounded text-sm relative z-10">{t("matchTitle")}</h4>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-4 relative z-10 w-full">
              {stage >= 1 ? (
                <div className="w-full bg-[#111] border border-white/5 rounded-lg p-3 flex flex-col items-center animate-in zoom-in duration-500">
                  <span className="text-[10px] text-[#A0A0A0] font-mono tracking-widest uppercase mb-1">
                    Target Reward
                  </span>
                  <div className="flex items-center gap-2 mb-3 bg-[#FFB703]/10 px-3 py-1.5 rounded-full border border-[#FFB703]/20">
                    <div className="flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 397 311" fill="#FFB703">
                        <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
                        <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
                        <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
                      </svg>
                    </div>
                    <span className="text-[#FFB703] font-mono font-bold text-sm">1.50 SOL</span>
                  </div>

                  <div className="w-full flex justify-between border-t border-white/5 pt-2 text-[10px] font-mono text-[#666]">
                    <span>Stake Locked:</span>
                    <span className={stage >= 2 ? "text-[#F43F5E] transition-colors" : ""}>-1.00 SOL</span>
                  </div>
                </div>
              ) : (
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#666] animate-pulse py-10">
                  Waiting for target...
                </span>
              )}
            </div>

            {stage >= 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#111]">
                <div
                  className={`h-full bg-[#F43F5E] transition-all duration-[1700ms] ease-out ${stage >= 2 ? "w-full" : "w-0"}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`px-5 py-4 bg-white/[0.02] border-t border-white/5 transition-all duration-500 ${stage === 2 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none hidden"}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[#888] font-onest text-[13px] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] shadow-[0_0_8px_#F43F5E]" />
            Stake temporarily locked for current execution.
          </span>
          <button
            onClick={onNext}
            className="px-6 py-2.5 bg-[#F43F5E]/10 border border-[#F43F5E]/30 hover:bg-[#F43F5E]/20 hover:border-[#F43F5E]/50 text-[#F43F5E] rounded-lg font-unbounded text-[12px] font-medium tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.15)] flex items-center gap-2"
          >
            {t("btnNext")}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
