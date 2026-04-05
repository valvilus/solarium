"use client";

import { useTranslations } from "next-intl";
import { TutorialNode } from "./TutorialNode";
import { useState, useEffect } from "react";

export function Step3IPFSNode({ onNext }: { onNext: () => void }) {
  const t = useTranslations("StudyModePage.step3");
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 2000);
    const timer3 = setTimeout(() => setStage(3), 4000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const SkyTheme = "#38BDF8";

  return (
    <div
      className={`w-[1000px] shrink-0 bg-[#050505]/95 border border-[#38BDF8]/40 shadow-[0_0_30px_rgba(56,189,248,0.1)] rounded-xl backdrop-blur-xl flex flex-col relative overflow-hidden transition-all duration-500`}
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
          <div className="bg-[#38BDF8]/5 border border-[#38BDF8]/10 rounded-lg p-5">
            <p className="text-[#38BDF8]/90 text-[13px] font-onest leading-relaxed">{t("longText1")}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5">
            <p className="text-white/60 text-[13px] font-onest leading-relaxed">{t("longText2")}</p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_250px_1fr] gap-4 items-stretch h-[320px]">
          <div className="bg-[#050505] border border-white/5 p-4 rounded-xl flex flex-col relative overflow-hidden shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-mono text-xs uppercase tracking-widest">{t("dataMergeTitle")}</h4>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-3 relative">
              <div className="flex gap-4 w-full justify-center">
                <div
                  className={`px-3 py-2 bg-[#8ECAE6]/10 border border-[#8ECAE6]/20 rounded text-[#8ECAE6] text-[10px] font-mono transition-transform duration-700 ${stage >= 1 ? "translate-y-4 opacity-50" : ""}`}
                >
                  [01] Prompt & Schema
                </div>
                <div
                  className={`px-3 py-2 bg-[#FFB703]/10 border border-[#FFB703]/20 rounded text-[#FFB703] text-[10px] font-mono transition-transform duration-700 ${stage >= 1 ? "translate-y-4 opacity-50" : ""}`}
                >
                  [02] User Payload
                </div>
              </div>

              <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />

              <div
                className={`w-full h-[190px] bg-white/[0.02] border border-white/10 rounded-lg transition-all duration-1000 flex flex-col overflow-hidden ${stage >= 1 ? "border-[#38BDF8]/50 shadow-[0_0_15px_rgba(56,189,248,0.2)]" : "opacity-20 saturate-0"}`}
              >
                <div className="px-3 py-2 flex items-center gap-2 border-b border-white/5 bg-[#050505]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#38BDF8" viewBox="0 0 256 256">
                    <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path>
                  </svg>
                  <span className="text-[#38BDF8] text-[10px] font-mono">TaskManifest.json (5.2 KB)</span>
                </div>
                <div className="flex-1 overflow-auto p-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <pre className="text-[9.5px] text-[#A0A0A0] font-mono leading-relaxed">
                    {`{
  "manifest_version": "1.0.0",
  "protocol": "solarium-core",
  "dapp_origin": "https://defi-platform.io",
  "signature": "3Xkp...bVf9",
  "task": {
    "title": "Wash Trading AI Analysis",
    "type": "analyze_anomaly",
    "workerPrompt": "You are an enterprise financial AI. Analyze this DeFi transaction for signs of Wash Trading or manipulation. Validate slippage rates against historical norms. Return valid JSON only.",
    "expectedSchema": { 
      "verdict": "number (1=Safe, 2=Suspicious, 3=Malicious)",
      "confidence_score": "number (0-100)",
      "fraud_vectors": "array of strings",
      "reasoning": "string (max 500 chars)"
    }
  },
  "payload": {
    "execution_timestamp": "1738592301",
    "user_wallet": "A3vakHmbWdDigkGtW6kPQWjNNTq8uv2LJKW7QUpcZ2xUc",
    "action_type": "SWAP",
    "dex_router": "Jupiter_V6",
    "asset_in": {
      "token": "USDC",
      "amount": "50000.00",
      "contract": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    },
    "asset_out": {
      "token": "SOL",
      "expected": "250.4",
      "slippage_tolerance": "0.005"
    },
    "historical_context": {
      "wallet_age_days": 2,
      "prior_volume_usd": "145000.00",
      "flagged_interactions": 0
    }
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 py-8">
            {stage >= 2 ? (
              <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
                <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest">{t("ipfsTitle")}</span>

                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div
                    className={`absolute inset-0 border-2 rounded-xl transition-all duration-1000 ${stage === 3 ? "border-[#38BDF8] bg-[#38BDF8]/5 rotate-45 scale-100" : "border-white/10 scale-90 border-dashed animate-[spin_4s_linear_infinite]"}`}
                  />
                  <div
                    className={`absolute inset-2 border border-[#38BDF8]/50 rounded-lg transition-all duration-1000 ${stage === 3 ? "rotate-[60deg]" : "animate-[spin_3s_linear_infinite_reverse]"}`}
                  />

                  {stage < 3 ? (
                    <span className="font-mono text-[#38BDF8] text-[10px] z-10 animate-pulse">UPLOADING</span>
                  ) : (
                    <span className="font-mono text-[#38BDF8] text-[10px] z-10 font-bold">PINNED</span>
                  )}
                </div>

                <div className="w-[120px] h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
                  <div
                    className={`h-full bg-[#38BDF8] transition-all duration-[2000ms] ease-out ${stage >= 2 ? (stage === 3 ? "w-full" : "w-[60%]") : "w-0"}`}
                  />
                </div>
              </div>
            ) : (
              <div className="text-white/20 text-xs font- моно text-center p-4 border border-white/5 border-dashed rounded-lg">
                Awaiting Payload...
              </div>
            )}
          </div>

          <div className="bg-[#050505] border border-white/5 p-4 rounded-xl flex flex-col relative overflow-hidden shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-mono text-xs uppercase tracking-widest">{t("hashTitle")}</h4>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4">
              {stage === 3 ? (
                <div className="animate-in slide-in-from-left duration-500 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[#666] text-[10px] uppercase font-mono tracking-widest">
                      Storage CID (URI)
                    </span>
                    <div className="w-full bg-[#38BDF8]/5 border border-[#38BDF8]/20 rounded p-2.5 text-[#38BDF8] text-[11px] font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                      ipfs://QmPzKXh9GzYwA...xHfD
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[#666] text-[10px] uppercase font-mono tracking-widest">
                        Input Hash (32 Bytes)
                      </span>
                      <span className="text-[#22c55e] text-[9px] uppercase tracking-widest border border-[#22c55e]/20 px-1.5 py-0.5 rounded bg-[#22c55e]/10">
                        Solana Ready
                      </span>
                    </div>
                    <div className="w-full bg-[#111] border border-white/5 rounded p-3 text-white text-[10px] font-mono grid grid-cols-8 gap-x-2 gap-y-1.5">
                      <span>241</span>
                      <span className="text-white/40">,</span>
                      <span>012</span>
                      <span className="text-white/40">,</span>
                      <span>119</span>
                      <span className="text-white/40">,</span>
                      <span>088</span>
                      <span className="text-white/40">,</span>
                      <span>005</span>
                      <span className="text-white/40">,</span>
                      <span>200</span>
                      <span className="text-white/40">,</span>
                      <span>199</span>
                      <span className="text-white/40">,</span>
                      <span>065</span>
                      <span className="text-white/40">,</span>
                      <span className="col-span-8 text-[#666]">... (32 total elements) ...</span>
                      <span>000</span>
                      <span className="text-white/40">,</span>
                      <span>213</span>
                      <span className="text-white/40">,</span>
                      <span>099</span>
                      <span className="text-white/40">,</span>
                      <span>144</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                  <span className="text-[#666] font-mono text-[10px] uppercase tracking-widest border border-white/5 px-3 py-1.5 rounded bg-[#111]">
                    Waiting for CID
                  </span>
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
            <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            Compression Factor: ~99.3% reduction for on-chain storage.
          </span>
          <button
            onClick={onNext}
            className="px-6 py-2.5 bg-[#38BDF8]/10 border border-[#38BDF8]/30 hover:bg-[#38BDF8]/20 hover:border-[#38BDF8]/50 text-[#38BDF8] rounded-lg font-unbounded text-[12px] font-medium tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.15)] flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
            </svg>
            {t("btnNext")}
          </button>
        </div>
      </div>
    </div>
  );
}
