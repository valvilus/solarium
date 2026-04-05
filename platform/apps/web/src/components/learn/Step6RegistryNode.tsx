"use client";

import { useTranslations } from "next-intl";
import { TutorialNode } from "./TutorialNode";
import { useState, useEffect } from "react";

export function Step6RegistryNode({ onNext }: { onNext: () => void }) {
  const t = useTranslations("StudyModePage.step6");
  const [staked, setStaked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStaked(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`w-[950px] shrink-0 bg-[#050505]/95 border border-[#A855F7]/40 shadow-[0_0_30px_rgba(168,85,247,0.1)] rounded-xl backdrop-blur-xl flex flex-col relative overflow-hidden transition-all duration-500`}
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
            <p className="text-[#A855F7]/90 text-[13px] font-onest leading-relaxed">{t("longText1")}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5 flex flex-col justify-center">
            <p className="text-white/60 text-[13px] font-onest leading-relaxed mb-3">{t("longText2")}</p>
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 bg-[#111] border border-white/10 rounded p-2 text-center">
                <span className="text-[10px] font-mono text-[#666] block mb-1">Cold Wallet (Operator)</span>
                <span className="text-white text-xs font-mono">B3kF...8Xqm</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#444" viewBox="0 0 256 256">
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
              </svg>
              <div className="flex-1 bg-[#222] border border-[#ff4d4d]/30 rounded p-2 text-center">
                <span className="text-[10px] font-mono text-[#ff4d4d] block mb-1">Hot Wallet (Docker Burner)</span>
                <span className="text-white text-xs font-mono">7Ua2...P1zc</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_350px] gap-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-xl block relative overflow-hidden shadow-inner">
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-white font-unbounded text-sm">{t("registryTitle")}</h4>
              <span className="text-[10px] text-[#A855F7]/80 uppercase tracking-widest bg-[#A855F7]/10 px-2 py-0.5 rounded border border-[#A855F7]/20">
                On-Chain
              </span>
            </div>

            <div className="bg-[#050505] p-4 rounded-lg border border-white/5 font-mono text-[12px] leading-relaxed relative">
              <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#A855F7]/0 via-[#A855F7] to-[#A855F7]/0 rounded-r opacity-50" />

              <div className="flex mb-2">
                <span className="text-[#888] w-36 shrink-0">address:</span>
                <span className="text-[#A855F7]">NxR8...3Qwq</span>
              </div>
              <div className="flex mb-2">
                <span className="text-[#888] w-36 shrink-0">owner:</span>
                <span className="text-white">Solarium Program</span>
              </div>
              <div className="flex mb-2">
                <span className="text-[#888] w-36 shrink-0">data.operator:</span>
                <span className="text-white">B3kF...8Xqm (Cold)</span>
              </div>
              <div className="flex mb-2">
                <span className="text-[#888] w-36 shrink-0">data.delegated_worker:</span>
                <span className="text-[#ff4d4d]">7Ua2...P1zc (Hot)</span>
              </div>
              <div className="flex mb-2">
                <span className="text-[#888] w-36 shrink-0">data.node_type:</span>
                <span className="text-white">WORKER</span>
              </div>
              <div className="flex mt-4 pt-3 border-t border-white/5">
                <span className="text-[#888] w-36 shrink-0">data.locked_stake:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest transition-all duration-700 ${staked ? "bg-purple-500/20 text-[#A855F7] border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]" : "bg-white/5 text-[#666] border border-white/10"}`}
                >
                  {staked ? "1.0 SOL" : "0.0 SOL (WAITING)"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#050505] border border-white/5 p-5 rounded-xl flex flex-col relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#A855F7]/10 blur-[50px] rounded-full" />
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-white font-unbounded text-sm relative z-10">{t("txTitle")}</h4>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-4 relative z-10 pb-4">
              <div
                className={`relative w-28 h-32 rounded-xl border-2 transition-all duration-1000 flex flex-col items-center justify-end pb-4 bg-gradient-to-t ${staked ? "border-[#A855F7] from-[#A855F7]/20 to-transparent shadow-[0_0_30px_rgba(168,85,247,0.15)]" : "border-white/10 from-white/5 to-transparent"}`}
              >
                <div
                  className={`absolute -top-6 w-12 h-12 rounded-full border-4 flex items-center justify-center bg-[#050505] transition-all duration-500 ${staked ? "border-[#A855F7] text-[#A855F7]" : "border-[#444] text-[#444]"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M116,96a12,12,0,1,0-12-12A12,12,0,0,0,116,96Zm0,64a12,12,0,1,0-12-12A12,12,0,0,0,116,160Zm91.13,32.74H48.87A24,24,0,0,1,28.23,156.4L105.74,22.12a23.94,23.94,0,0,1,41.47,0l77.51,134.28A24,24,0,0,1,207.13,192.74Z"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    ></path>
                  </svg>
                </div>

                <div
                  className={`transition-all duration-700 delay-300 transform flex flex-col items-center ${staked ? "translate-y-0 opacity-100 scale-100" : "-translate-y-12 opacity-0 scale-50"}`}
                >
                  <div className="w-12 h-12 bg-[#FFB703] rounded-full shadow-[0_0_20px_#FFB703] flex items-center justify-center mb-1 border-2 border-white/20">
                    <svg width="16" height="16" viewBox="0 0 397 311" fill="#000">
                      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
                      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
                      <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
                    </svg>
                  </div>
                  <span className="text-[#FFB703] font-mono text-lg font-bold">1.000</span>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono uppercase tracking-widest transition-opacity duration-1000 text-center ${staked ? "text-[#A855F7] opacity-100" : "text-[#666] opacity-0"}`}
              >
                Worker Stake Locked
                <br />
                Network Trust Established
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`px-5 py-4 bg-white/[0.02] border-t border-white/5 transition-all duration-500 ${staked ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none hidden"}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[#888] font-onest text-[13px] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7]" />
            Network node authenticated and registered.
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
