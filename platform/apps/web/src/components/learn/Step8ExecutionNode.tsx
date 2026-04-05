"use client";

import { useTranslations } from "next-intl";
import { TutorialNode } from "./TutorialNode";
import { useState, useEffect } from "react";

export function Step8ExecutionNode({ onNext }: { onNext: () => void }) {
  const t = useTranslations("StudyModePage.step8");
  const [stage, setStage] = useState(0);
  const [typedText, setTypedText] = useState("");

  const inferenceText = `{\n  "verdict": 1,\n  "confidence": 98,\n  "reasoning": "Standard Jupiter AMM swap. Flow analysis indicates no malicious smart contract interactions. Clean payload."\n}`;

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage(1);
    }, 1500);

    let i = 0;
    let t2: NodeJS.Timeout;
    const t2_start = setTimeout(() => {
      setStage(2);
      t2 = setInterval(() => {
        setTypedText(inferenceText.substring(0, i));
        i++;
        if (i > inferenceText.length) {
          clearInterval(t2);

          setTimeout(() => setStage(3), 800);
        }
      }, 20);
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2_start);
      if (t2) clearInterval(t2);
    };
  }, []);

  return (
    <div
      className={`w-[950px] shrink-0 bg-[#050505]/95 border border-[#8B5CF6]/40 shadow-[0_0_30px_rgba(139,92,246,0.15)] rounded-xl backdrop-blur-xl flex flex-col relative overflow-hidden transition-all duration-500`}
    >
      <div className="px-5 py-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-mono uppercase tracking-widest leading-none">
            {t("role")}
          </span>
        </div>
        <h3 className="font-unbounded font-medium text-white text-xl">{t("title")}</h3>
        <p className="text-[#A0A0A0] font-onest text-[14px] mt-2.5 leading-relaxed">{t("description")}</p>
      </div>

      <div className="p-5 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-[#10D9B0]/5 border border-[#10D9B0]/20 rounded-lg p-5 shadow-[inset_0_0_20px_rgba(16,217,176,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <svg width="40" height="40" viewBox="0 0 397 311" fill="#10D9B0">
                <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
                <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
                <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
              </svg>
            </div>
            <p className="text-white/80 text-[13px] font-onest leading-relaxed relative z-10">{t("longText1")}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5">
            <p className="text-white/60 text-[13px] font-onest leading-relaxed">{t("longText2")}</p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_350px] gap-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-xl block relative overflow-hidden shadow-inner">
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-white font-unbounded text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#8B5CF6" viewBox="0 0 256 256">
                  <path d="M216,112V64a16,16,0,0,0-16-16H152a16,16,0,0,0-16,16v48h80ZM200,64v32H152V64h48ZM104,112V64A16,16,0,0,0,88,48H40A16,16,0,0,0,24,64v48H104ZM88,64v32H40V64H88ZM216,208V160H136v48a16,16,0,0,0,16,16h48A16,16,0,0,0,216,208Zm-16,0H152V176h48v32ZM104,208V144H24v48a16,16,0,0,0,16,16H88A16,16,0,0,0,104,208Zm-16,0H40V160H88v48Z"></path>
                </svg>
                {t("executionTitle")}
              </h4>
              {stage >= 1 && (
                <span className="text-[10px] text-[#A0A0A0] bg-white/5 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#10D9B0] rounded-full animate-pulse" />
                  gemini-2.5-flash
                </span>
              )}
            </div>

            <div className="bg-[#020202] py-4 px-5 rounded-lg border border-white/5 font-mono text-[11px] leading-loose relative min-h-[180px]">
              {stage === 0 && <span className="text-[#666] animate-pulse">Awaiting task payload from IPFS...</span>}

              {stage >= 1 && (
                <div className="text-[#A0A0A0] flex flex-col gap-1 mb-3">
                  <span className="text-[#8B5CF6]">
                    ▶ IPFS.download("QmZ4...A9kK") <span className="text-green-400">Success</span>
                  </span>
                  <span>Applying strict JSON Schema enforcing...</span>
                  <span>Initiating LLM cold start...</span>
                </div>
              )}

              {stage >= 2 && (
                <div className="text-[#FFB703] whitespace-pre-wrap">
                  {typedText}
                  {stage === 2 && (
                    <span className="inline-block w-2.5 h-3.5 bg-[#FFB703] ml-1 animate-[pulse_0.8s_ease-in-out_infinite]" />
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            className={`bg-[#050505] border ${stage >= 3 ? "border-[#10D9B0]/30 shadow-[0_0_20px_rgba(16,217,176,0.1)]" : "border-white/5"} p-5 rounded-xl flex flex-col justify-between relative overflow-hidden transition-all duration-700`}
          >
            <h4 className="text-white font-unbounded text-sm mb-4 relative z-10">{t("ipfsReturnTitle")}</h4>

            <div className="flex-1 flex flex-col gap-5 p-2">
              <div
                className={`flex items-center gap-3 transition-all duration-500 delay-100 ${stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <div className="p-2 border border-white/10 rounded flex-1 flex flex-col">
                  <span className="text-[9px] text-[#666] font-mono leading-none mb-1">Reasoning IPFS Hash</span>
                  <span className="text-[#A0A0A0] text-[11px] font-mono border-b border-dashed border-[#666] pb-1">
                    bafybeigdyr...
                  </span>
                </div>
              </div>

              <div
                className={`p-3 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-lg flex flex-col gap-2 transition-all duration-500 delay-300 ${stage >= 3 ? "opacity-100" : "opacity-0"}`}
              >
                <span className="text-[9px] font-mono text-[#8B5CF6] uppercase tracking-widest text-center">
                  Cryptographic Commitment
                </span>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A0A0] px-2">
                  <span>Verdict:</span>
                  <span className="text-white">1</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A0A0] px-2">
                  <span>Confidence:</span>
                  <span className="text-white">98</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A0A0] px-2 overflow-hidden whitespace-nowrap">
                  <span>Salt:</span>
                  <span className="text-[#666]">0x4f...8a</span>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-[#666]">sha256(1 + 98 + salt)</span>
                  <span className="text-[#10D9B0] text-xs font-mono font-bold bg-[#10D9B0]/10 px-2 py-1 rounded">
                    0xb8a2f...c94
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`px-5 py-4 bg-white/[0.02] border-t border-white/5 transition-all duration-500 ${stage === 3 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none hidden"}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[#888] font-onest text-[13px] flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="#10D9B0" viewBox="0 0 256 256">
                <path d="M176,16V40A16,16,0,0,1,160,56H96A16,16,0,0,1,80,40V16A16,16,0,0,0,48,16V208a16,16,0,0,0,32,0V184a16,16,0,0,1,16-16h64a16,16,0,0,1,16,16v24a16,16,0,0,0,32,0V16A16,16,0,0,0,176,16Z"></path>
              </svg>
            </div>
            Hidden commitment is ready for consensus layer.
          </span>
          <button
            onClick={onNext}
            className="px-6 py-2.5 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 text-[#8B5CF6] rounded-lg font-unbounded text-[12px] font-medium tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.15)] flex items-center gap-2"
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
