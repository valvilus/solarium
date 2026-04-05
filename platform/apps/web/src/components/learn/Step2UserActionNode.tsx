"use client";

import { useTranslations } from "next-intl";
import { TutorialNode } from "./TutorialNode";
import { useState } from "react";

export function Step2UserActionNode({ onNext }: { onNext: () => void }) {
  const t = useTranslations("StudyModePage.step2");
  const [simulated, setSimulated] = useState(false);

  const handleSimulate = () => {
    setSimulated(true);
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  return (
    <div
      className={`w-[950px] shrink-0 bg-[#050505]/95 border border-[#FFB703]/40 shadow-[0_0_30px_rgba(255,183,3,0.08)] rounded-xl backdrop-blur-xl flex flex-col relative overflow-hidden transition-all duration-500`}
    >
      <div className="px-5 py-5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded bg-[#FFB703]/10 border border-[#FFB703]/20 text-[#FFB703] text-[10px] font-mono uppercase tracking-widest leading-none">
            {t("role")}
          </span>
        </div>
        <h3 className="font-unbounded font-medium text-white text-xl">{t("title")}</h3>
        <p className="text-[#A0A0A0] font-onest text-[14px] mt-2.5 leading-relaxed">{t("description")}</p>
      </div>

      <div className="p-5 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-[#FFB703]/5 border border-[#FFB703]/10 rounded-lg p-5">
            <p className="text-[#FFB703]/90 text-[14px] font-onest leading-relaxed">{t("longText1")}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5">
            <p className="text-white/60 text-[14px] font-onest leading-relaxed">{t("longText2")}</p>
          </div>
        </div>

        <div className="grid grid-cols-[380px_1fr] gap-6 items-stretch">
          <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-xl flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-white font-unbounded text-sm">{t("uiTitle")}</h4>
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
            </div>

            <div className="flex-1 border border-white/5 bg-[#111] rounded-xl p-4 flex flex-col gap-4">
              <div className="bg-[#1A1A1A] rounded-lg p-3 border border-white/5">
                <span className="text-[#666] text-xs font-mono uppercase">Pay</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-2xl text-white font-mono">50,000</span>
                  <span className="text-white font-unbounded px-2 py-1 bg-white/10 rounded">USDC</span>
                </div>
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <div className="w-8 h-8 bg-[#222] border border-white/10 rounded-full flex items-center justify-center text-[#888]">
                  ↓
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-lg p-3 border border-white/5">
                <span className="text-[#666] text-xs font-mono uppercase">Receive</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-2xl text-white font-mono">250.4</span>
                  <span className="text-[#FFB703] font-unbounded px-2 py-1 bg-[#FFB703]/10 border border-[#FFB703]/20 rounded">
                    SOL
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-xs font-mono text-[#666] px-1 mt-2">
                <span>Slippage Tolerance</span>
                <span className="text-[#FFB703]">0.5%</span>
              </div>

              {!simulated ? (
                <button
                  onClick={handleSimulate}
                  className="w-full mt-3 py-3.5 bg-white text-black font-onest font-medium rounded-lg hover:bg-white/90 transition-colors"
                >
                  Confirm Swap
                </button>
              ) : (
                <button
                  disabled
                  className="w-full mt-3 py-3.5 bg-white/5 text-[#FFB703] font-onest font-medium rounded-lg border border-[#FFB703]/30 flex items-center justify-center gap-3 animate-pulse"
                >
                  <div className="w-4 h-4 border-2 border-[#FFB703] border-t-transparent rounded-full animate-spin" />
                  AI Auditing...
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#050505] border border-white/5 rounded-xl overflow-hidden relative flex flex-col shadow-inner">
            <div className="bg-white/5 px-5 py-4 border-b border-white/5 flex items-center gap-3 shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#FFB703] animate-pulse" />
              <h4 className="text-[#888] font-mono text-[12px] uppercase tracking-widest">{t("payloadTitle")}</h4>

              {simulated && (
                <span className="ml-auto text-[10px] text-[#FFB703] bg-[#FFB703]/10 px-2 py-1 rounded border border-[#FFB703]/30 animate-in fade-in zoom-in">
                  CAPTURED
                </span>
              )}
            </div>

            <div className="flex-1 p-5 overflow-auto relative">
              <pre
                className={`text-[13px] leading-loose font-mono transition-all duration-700 ${simulated ? "text-[#FFB703]" : "text-[#444]"}`}
              >
                {`{
  "timestamp": "1738592301",
  "userWallet": "A3vakHmbWdDigkGtW6kPQWjNNTq8uv2LJKW7QUpcZ2xUc",
  "action": "SWAP",
  "asset_in": {
    "token": "USDC",
    "amount": "50000.00",
    "contract": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  },
  "asset_out": {
    "token": "SOL",
    "expected_amount": "250.4",
    "slippage": "0.005"
  },
  "historical_flags": {
    "account_age_days": 2,
    "previous_wash_volume": "145000.00"
  }
}`}
              </pre>

              {!simulated && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <span className="text-[#666] font-mono text-xs uppercase tracking-widest bg-black/80 px-4 py-2 rounded-lg border border-white/5">
                    Waiting for user action...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`px-5 py-4 bg-white/[0.02] border-t border-white/5 transition-all duration-500 ${simulated ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none hidden"}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[#888] font-onest text-[13px]">
            Next: The JSON payload is securely hashed and uploaded to IPFS.
          </span>
          <button
            onClick={onNext}
            className="px-6 py-2.5 bg-[#FFB703]/10 border border-[#FFB703]/30 hover:bg-[#FFB703]/20 hover:border-[#FFB703]/50 text-[#FFB703] rounded-lg font-unbounded text-[12px] font-medium tracking-wider uppercase transition-all duration-300 shadow-[0_0_15px_rgba(255,183,3,0.15)]"
          >
            {t("btnNext")}
          </button>
        </div>
      </div>
    </div>
  );
}
