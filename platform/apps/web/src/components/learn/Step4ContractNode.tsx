"use client";

import { useTranslations } from "next-intl";
import { TutorialNode } from "./TutorialNode";
import { useState, useEffect } from "react";

export function Step4ContractNode({ onNext }: { onNext: () => void }) {
  const t = useTranslations("StudyModePage.step4");
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLocked(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`w-[950px] shrink-0 bg-[#050505]/95 border border-[#10D9B0]/40 shadow-[0_0_30px_rgba(16,217,176,0.1)] rounded-xl backdrop-blur-xl flex flex-col relative overflow-hidden transition-all duration-500`}
    >
      <div className="px-5 py-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded bg-[#10D9B0]/10 border border-[#10D9B0]/20 text-[#10D9B0] text-[10px] font-mono uppercase tracking-widest leading-none">
            {t("role")}
          </span>
        </div>
        <h3 className="font-unbounded font-medium text-white text-xl">{t("title")}</h3>
        <p className="text-[#A0A0A0] font-onest text-[14px] mt-2.5 leading-relaxed">{t("description")}</p>
      </div>

      <div className="p-5 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-[#10D9B0]/5 border border-[#10D9B0]/10 rounded-lg p-5">
            <p className="text-[#10D9B0]/90 text-[13px] font-onest leading-relaxed">{t("longText1")}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5">
            <p className="text-white/60 text-[13px] font-onest leading-relaxed">{t("longText2")}</p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_350px] gap-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-xl block relative overflow-hidden shadow-inner">
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-white font-unbounded text-sm">{t("pdaTitle")}</h4>
              <span className="text-[10px] text-[#10D9B0]/80 uppercase tracking-widest bg-[#10D9B0]/10 px-2 py-0.5 rounded border border-[#10D9B0]/20">
                On-Chain
              </span>
            </div>

            <div className="bg-[#050505] p-4 rounded-lg border border-white/5 font-mono text-[12px] leading-relaxed relative">
              <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#10D9B0]/0 via-[#10D9B0] to-[#10D9B0]/0 rounded-r opacity-50" />

              <div className="flex mb-2">
                <span className="text-[#888] w-32 shrink-0">address:</span>
                <span className="text-[#10D9B0]">8xKf...9Tqy</span>
              </div>
              <div className="flex mb-2">
                <span className="text-[#888] w-32 shrink-0">owner:</span>
                <span className="text-white">Solarium Program</span>
              </div>
              <div className="flex mb-2">
                <span className="text-[#888] w-32 shrink-0">data.input_hash:</span>
                <span className="text-[#38BDF8] break-all group relative cursor-help">
                  [241, 12, 119, 88, ... 32 elem]
                </span>
              </div>
              <div className="flex mb-2">
                <span className="text-[#888] w-32 shrink-0">data.reward_pda:</span>
                <span className="text-[#FFB703]">Vx99...L2pP</span>
              </div>
              <div className="flex mb-2">
                <span className="text-[#888] w-32 shrink-0">data.validators:</span>
                <span className="text-white">0 / 3 joined</span>
              </div>
              <div className="flex mt-4 pt-3 border-t border-white/5">
                <span className="text-[#888] w-32 shrink-0">data.status:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest transition-all duration-700 ${locked ? "bg-green-500/20 text-green-500 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-white/5 text-[#666] border border-white/10"}`}
                >
                  {locked ? "OPEN" : "INITIALIZING"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#050505] border border-white/5 p-5 rounded-xl flex flex-col relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#10D9B0]/10 blur-[50px] rounded-full" />
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-white font-unbounded text-sm relative z-10">{t("vaultTitle")}</h4>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-4 relative z-10 pb-4">
              <div
                className={`relative w-28 h-32 rounded-xl border-2 transition-all duration-1000 flex flex-col items-center justify-end pb-4 bg-gradient-to-t ${locked ? "border-[#10D9B0] from-[#10D9B0]/20 to-transparent shadow-[0_0_30px_rgba(16,217,176,0.15)]" : "border-white/10 from-white/5 to-transparent"}`}
              >
                <div
                  className={`absolute -top-6 w-12 h-12 rounded-full border-4 flex items-center justify-center bg-[#050505] transition-all duration-500 ${locked ? "border-[#10D9B0] text-[#10D9B0]" : "border-[#444] text-[#444]"}`}
                >
                  {locked ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-80-56a16,16,0,1,1-16-16A16,16,0,0,1,128,152Z"></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M208,80H108V56a20,20,0,0,1,40,0,8,8,0,0,0,16,0,36,36,0,0,0-72,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm0,128H48V96H208V208Zm-80-56a16,16,0,1,1-16-16A16,16,0,0,1,128,152Z"></path>
                    </svg>
                  )}
                </div>

                <div
                  className={`transition-all duration-700 delay-300 transform flex flex-col items-center ${locked ? "translate-y-0 opacity-100 scale-100" : "-translate-y-12 opacity-0 scale-50"}`}
                >
                  <div className="w-12 h-12 bg-[#FFB703] rounded-full shadow-[0_0_20px_#FFB703] flex items-center justify-center mb-1 border-2 border-white/20">
                    <svg width="16" height="16" viewBox="0 0 397 311" fill="#000">
                      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
                      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
                      <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
                    </svg>
                  </div>
                  <span className="text-[#FFB703] font-mono text-lg font-bold">1.500</span>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono uppercase tracking-widest transition-opacity duration-1000 ${locked ? "text-[#10D9B0] opacity-100" : "text-[#666] opacity-0"}`}
              >
                Escrow Locked & Funded
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`px-5 py-4 bg-white/[0.02] border-t border-white/5 transition-all duration-500 ${locked ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none hidden"}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[#888] font-onest text-[13px] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10D9B0] shadow-[0_0_8px_#10D9B0]" />
            The network is now aware of the bounty.
          </span>
          <button
            onClick={onNext}
            className="px-6 py-2.5 bg-[#10D9B0]/10 border border-[#10D9B0]/30 hover:bg-[#10D9B0]/20 hover:border-[#10D9B0]/50 text-[#10D9B0] rounded-lg font-unbounded text-[12px] font-medium tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(16,217,176,0.15)] flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,120v16a8,8,0,0,1-16,0V120a16,16,0,0,0-16-16H152v32a8,8,0,0,1-16,0V104H104v4.5A16.14,16.14,0,0,1,101.44,120,44.75,44.75,0,0,0,136,160h.24A45.41,45.41,0,0,0,184,128a8,8,0,0,1,16,0,61.4,61.4,0,0,1-61.94,64H136a60.77,60.77,0,0,1-46.73-22A16,16,0,0,1,64,184H48v16a8,8,0,0,1-16,0V184a16,16,0,0,1,16-16H64a16,16,0,0,1,16,16A44.7,44.7,0,0,0,120,160V88H64a16,16,0,0,1-16-16V56A16,16,0,0,1,64,40h32V24a8,8,0,0,1,16,0V40h24V24a8,8,0,0,1,16,0V40h40a16,16,0,0,1,16,16v8a8,8,0,0,1-16,0V56H152V88h40A16,16,0,0,1,208,104Zm-160-8v8H96V56H64ZM136,40H112V88h24Z"></path>
            </svg>
            {t("btnNext")}
          </button>
        </div>
      </div>
    </div>
  );
}
