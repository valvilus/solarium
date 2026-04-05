"use client";

import { useTranslations } from "next-intl";
import { TutorialNode } from "./TutorialNode";
import { useState, useEffect } from "react";

export function Step9ConsensusNode({ onNext }: { onNext: () => void }) {
  const t = useTranslations("StudyModePage.step9");
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage(1);
    }, 1500);

    const t2 = setTimeout(() => {
      setStage(2);
    }, 4000);

    const t3 = setTimeout(() => {
      setStage(3);
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div
      className={`w-[950px] shrink-0 bg-[#050505]/95 border border-[#38BDF8]/40 shadow-[0_0_30px_rgba(56,189,248,0.15)] rounded-xl backdrop-blur-xl flex flex-col relative overflow-hidden transition-all duration-500`}
    >
      <div className="px-5 py-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-[10px] font-mono uppercase tracking-widest leading-none">
            {t("role")}
          </span>
        </div>
        <h3 className="font-unbounded font-medium text-white text-xl">{t("title")}</h3>
        <p className="text-[#A0A0A0] font-onest text-[14px] mt-2.5 leading-relaxed">{t("description")}</p>
      </div>

      <div className="p-5 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-[#38BDF8]/5 border border-[#38BDF8]/20 rounded-lg p-5">
            <p className="text-white/80 text-[13px] font-onest leading-relaxed">{t("longText1")}</p>
          </div>
          <div className="bg-[#F43F5E]/5 border border-[#F43F5E]/20 rounded-lg p-5">
            <p className="text-white/80 text-[13px] font-onest leading-relaxed">{t("longText2")}</p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_400px] gap-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-xl block relative overflow-hidden shadow-inner">
            <h4 className="text-white font-unbounded text-sm mb-4">{t("validatorTitle")}</h4>

            <div className="flex flex-col gap-3 font-mono text-[11px] h-[180px]">
              <div
                className={`flex flex-col gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-lg transition-all duration-500 ${stage >= 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[#A0A0A0]">Validator #001 (Solana-Mainnet)</span>
                  {stage >= 2 ? (
                    <span className="text-[#10D9B0]">Vote: AGREE</span>
                  ) : (
                    <span className="text-yellow-500 animate-pulse">Running Verification...</span>
                  )}
                </div>
                <span className="text-[#666]">Prompt: Evaluate reasoning...</span>
              </div>

              <div
                className={`flex flex-col gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-lg transition-all duration-500 delay-150 ${stage >= 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[#A0A0A0]">Validator #045 (AWS-Region-03)</span>
                  {stage >= 2 ? (
                    <span className="text-[#10D9B0]">Vote: AGREE</span>
                  ) : (
                    <span className="text-yellow-500 animate-pulse">Running Verification...</span>
                  )}
                </div>
                <span className="text-[#666]">Prompt: Evaluate reasoning...</span>
              </div>

              <div
                className={`flex flex-col gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-lg transition-all duration-500 delay-300 ${stage >= 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-[#A0A0A0]">Validator #112 (Hetzner-EU)</span>
                  {stage >= 2 ? (
                    <span className="text-[#10D9B0]">Vote: AGREE</span>
                  ) : (
                    <span className="text-yellow-500 animate-pulse">Running Verification...</span>
                  )}
                </div>
                <span className="text-[#666]">Prompt: Evaluate reasoning...</span>
              </div>
            </div>
          </div>

          <div
            className={`bg-[#050505] border ${stage >= 3 ? "border-[#38BDF8]/50 shadow-[0_0_20px_rgba(56,189,248,0.2)]" : "border-white/5"} p-5 rounded-xl flex flex-col justify-between relative overflow-hidden transition-all duration-700`}
          >
            <h4 className="text-white font-unbounded text-sm mb-4 relative z-10">{t("revealTitle")}</h4>

            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A0A0]">
                <span>Phase:</span>
                <span className={stage >= 3 ? "text-white" : "text-yellow-500"}>
                  {stage >= 3 ? "REVEALING" : "COMMITTING"}
                </span>
              </div>

              <div className="space-y-3 mt-2 font-mono text-[10px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[#666]">Node</span>
                  <span className="text-[#666]">Committed Hash</span>
                  <span className="text-[#666]">Revealed Salt</span>
                </div>

                <div
                  className={`flex items-center justify-between transition-all duration-300 ${stage >= 3 ? "text-white" : "text-[#666]"}`}
                >
                  <span className="text-[#8B5CF6]">Worker</span>
                  <span>0xb8a2f...</span>
                  <span>{stage >= 3 ? "0x4f...8a" : "********"}</span>
                </div>

                <div
                  className={`flex items-center justify-between transition-all duration-300 delay-100 ${stage >= 3 ? "text-white" : "text-[#666]"}`}
                >
                  <span className="text-[#38BDF8]">Val #1</span>
                  <span>0x11cc2...</span>
                  <span>{stage >= 3 ? "0x88...1f" : "********"}</span>
                </div>

                <div
                  className={`flex items-center justify-between transition-all duration-300 delay-200 ${stage >= 3 ? "text-white" : "text-[#666]"}`}
                >
                  <span className="text-[#38BDF8]">Val #2</span>
                  <span>0x99dd4...</span>
                  <span>{stage >= 3 ? "0xaa...8b" : "********"}</span>
                </div>

                <div
                  className={`flex items-center justify-between transition-all duration-300 delay-300 ${stage >= 3 ? "text-white" : "text-[#666]"}`}
                >
                  <span className="text-[#38BDF8]">Val #3</span>
                  <span>0x55ff6...</span>
                  <span>{stage >= 3 ? "0xcc...9c" : "********"}</span>
                </div>
              </div>

              {stage >= 3 && (
                <div className="mt-auto animate-in zoom-in duration-300 flex justify-center">
                  <div className="px-3 py-1.5 bg-[#10D9B0]/20 border border-[#10D9B0] text-[#10D9B0] text-[10px] uppercase tracking-widest rounded shadow-[0_0_15px_rgba(16,217,176,0.3)]">
                    Task OptimisticFinalized
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`px-5 py-4 bg-white/[0.02] border-t border-white/5 transition-all duration-500 ${stage === 3 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none hidden"}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[#888] font-onest text-[13px] flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#38BDF8] rounded-full shadow-[0_0_8px_#38BDF8]" />
            Trust verified by consensus logic.
          </span>
          <button
            onClick={onNext}
            className="px-6 py-2.5 bg-[#38BDF8]/10 border border-[#38BDF8]/30 hover:bg-[#38BDF8]/20 hover:border-[#38BDF8]/50 text-[#38BDF8] rounded-lg font-unbounded text-[12px] font-medium tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.15)] flex items-center gap-2"
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
