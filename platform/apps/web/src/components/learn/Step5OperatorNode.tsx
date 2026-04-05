"use client";

import { useTranslations } from "next-intl";
import { TutorialNode } from "./TutorialNode";
import { useState, useEffect } from "react";

export function Step5OperatorNode({ onNext }: { onNext: () => void }) {
  const t = useTranslations("StudyModePage.step5");
  const [booting, setBooting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!booting) return;

    const bootSequence = [
      "docker pull solarium-labs/worker-node:latest",
      "Pulling fs layer...",
      "Digest: sha256:8b4f...3c9a",
      "Status: Downloaded newer image",
      "Starting Solarium AI Client (v1.2.0)...",
      "Detected Model Config: External API Gateway [Gemini]",
      "Applying Strict Inference Rules: [Temp=0] [JSON=true]",
      "Connecting to Solana Mainnet-Beta RPC...",
      "✅ Node Environment Ready. Awaiting Stake.",
    ];

    let i = 0;
    const interval = setInterval(() => {
      const line = bootSequence[i];
      if (line !== undefined) {
        setLogs((prev) => [...prev, line]);
      }
      i++;
      if (i >= bootSequence.length) {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [booting]);

  return (
    <div
      className={`w-[1050px] shrink-0 bg-[#050505]/95 border border-[#A855F7]/40 shadow-[0_0_30px_rgba(168,85,247,0.1)] rounded-xl backdrop-blur-xl flex flex-col relative overflow-hidden transition-all duration-500`}
    >
      <div className="px-5 py-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded bg-[#A855F7]/10 border border-[#A855F7]/20 text-[#A855F7] text-[10px] font-mono uppercase tracking-widest leading-none">
            {t("role")}
          </span>
        </div>
        <h3 className="font-unbounded font-medium text-white text-xl">{t("title")}</h3>
        <p className="text-[#A0A0A0] font-onest text-[14px] mt-2.5 leading-relaxed">{t("description")}</p>
      </div>

      <div className="p-5 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-[#A855F7]/5 border border-[#A855F7]/10 rounded-lg p-5">
            <p className="text-[#A855F7]/90 text-[13.5px] font-onest leading-relaxed">{t("longText1")}</p>
          </div>
          <div className="bg-white/[0.02] border border-[#ff4d4d]/10 rounded-lg p-5">
            <p className="text-[#ffb3b3]/80 text-[13.5px] font-onest leading-relaxed">{t("longText2")}</p>
          </div>
        </div>

        <div className="grid grid-cols-[400px_1fr] gap-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-xl block relative overflow-hidden shadow-inner">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-white font-unbounded text-sm">{t("modelConfigTitle")}</h4>
            </div>

            <div className="flex bg-[#111] border border-white/10 rounded-lg p-1 mb-6">
              <button className="flex-1 py-2 text-xs font-mono text-[#666] hover:bg-white/5 rounded transition-colors">
                {t("localModelLabel")}
              </button>
              <button className="flex-1 py-2 text-xs font-mono text-[#A855F7] bg-[#A855F7]/10 border border-[#A855F7]/20 rounded shadow-[0_0_10px_rgba(168,85,247,0.1)] transition-colors">
                {t("apiModelLabel")}
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-[#A0A0A0]">
                  <span>Model Target</span>
                  <span className="text-[#A855F7]">Gemini-1.5-Pro</span>
                </div>
                <div className="w-full h-1 bg-[#222] rounded overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-[#A855F7]/50 to-[#A855F7]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-[#A0A0A0]">
                  <span>Temperature (Creativity)</span>
                  <span className="text-[#ff4d4d] font-bold">0.0 (Deterministic)</span>
                </div>
                <div className="w-full h-1 bg-[#222] rounded overflow-hidden relative">
                  <div className="absolute w-1 h-full bg-[#ff4d4d] shadow-[0_0_5px_#ff4d4d]" style={{ left: "0%" }} />
                </div>
                <span className="text-[9px] text-[#666] italic leading-tight block">
                  Prevents hallucinations. Essential for consensus validation.
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-[#A0A0A0]">
                  <span>Output Format Modifier</span>
                  <span className="text-[#10D9B0]">Strict JSON Schema</span>
                </div>
                <div className="w-full h-1 bg-[#222] rounded overflow-hidden relative">
                  <div className="absolute w-full h-full bg-[#10D9B0]" />
                </div>
              </div>
            </div>

            {!booting && (
              <button
                onClick={() => setBooting(true)}
                className="w-full mt-6 py-3 bg-white/5 border border-white/10 hover:bg-[#A855F7]/20 hover:border-[#A855F7]/50 text-white hover:text-[#A855F7] text-xs font-mono uppercase tracking-widest rounded transition-all duration-300"
              >
                Boot Container
              </button>
            )}
          </div>

          <div className="bg-[#050505] border border-white/5 rounded-xl flex flex-col relative overflow-hidden shadow-inner">
            <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-[#888] font-mono text-xs">{t("terminalTitle")}</span>
            </div>
            <div className="flex-1 p-5 overflow-auto bg-[#0a0a0c]">
              {!booting ? (
                <div className="h-full flex items-center justify-center">
                  <span className="text-[#444] font-mono text-xs uppercase tracking-widest animate-pulse">Offline</span>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 font-mono text-[13px]">
                  {logs.map((log, idx) => {
                    if (!log) return null;
                    return (
                      <div key={idx} className="flex gap-3">
                        <span className="text-white/20 select-none">~</span>
                        <span
                          className={`${
                            log.includes("Pulling") || log.includes("Digest") || log.includes("Status")
                              ? "text-blue-400/70"
                              : log.includes("Detected") || log.includes("Applying")
                                ? "text-[#FFB703]"
                                : log.includes("Ready")
                                  ? "text-green-400 font-bold"
                                  : "text-[#A0A0A0]"
                          }`}
                        >
                          {log}
                        </span>
                      </div>
                    );
                  })}
                  {logs.length < 9 && <div className="w-2 h-4 bg-white/50 animate-[pulse_0.8s_ease-in-out_infinite]" />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`px-5 py-4 bg-white/[0.02] border-t border-white/5 transition-all duration-500 ${logs.length === 9 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none hidden"}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[#888] font-onest text-[13px] flex items-center gap-2">
            Infrastructure initialized.
          </span>
          <button
            onClick={onNext}
            className="px-6 py-2.5 bg-[#A855F7]/10 border border-[#A855F7]/30 hover:bg-[#A855F7]/20 hover:border-[#A855F7]/50 text-[#A855F7] rounded-lg font-unbounded text-[12px] font-medium tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.15)] flex items-center justify-center gap-2"
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
