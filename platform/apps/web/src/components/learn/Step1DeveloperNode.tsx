"use client";

import { useTranslations } from "next-intl";
import { TutorialNode } from "./TutorialNode";

export function Step1DeveloperNode({ onNext }: { onNext: () => void }) {
  const t = useTranslations("StudyModePage.step1");

  return (
    <TutorialNode roleBadge={t("role")} title={t("title")} description={t("description")}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-[#8ECAE6]/5 border border-[#8ECAE6]/10 rounded-lg p-5">
            <p className="text-[#8ECAE6]/90 text-[14px] font-onest leading-relaxed">{t("longText")}</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-5">
            <p className="text-white/60 text-[14px] font-onest leading-relaxed">{t("longText2")}</p>
          </div>
        </div>

        <div className="grid grid-cols-[400px_1fr] gap-6">
          <div className="space-y-5 bg-white/[0.01] border border-white/5 p-5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-unbounded text-sm">Manifest Config</h4>
              <span className="text-[10px] text-[#8ECAE6]/80 uppercase tracking-widest bg-[#8ECAE6]/10 px-2.5 py-1 rounded border border-[#8ECAE6]/20">
                Off-Chain
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#666] flex justify-between">
                {t("promptLabel")}
              </label>
              <textarea
                className="w-full bg-[#050505] border border-white/5 rounded-md p-3 text-[13px] text-[#CCC] font-onest h-[110px] outline-none focus:border-[#8ECAE6]/50 transition-colors resize-none leading-relaxed"
                readOnly
                value="You are an enterprise financial AI. Analyze this DeFi transaction for signs of Wash Trading or manipulation. Read the provided JSON data and output a strictly typed verification report."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#666]">
                {t("inputDataLabel")}
              </label>
              <textarea
                className="w-full bg-[#050505] border border-white/5 rounded-md p-3 text-[13px] text-[#4895EF] font-mono h-[110px] outline-none transition-colors resize-none leading-relaxed"
                readOnly
                value={`{
  "txId": "0xabc123...def",
  "contractor": "Magi...1bC",
  "amount": "50000 USDC",
  "historyLogs": [...]
}`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#666]">{t("schemaLabel")}</label>
              <textarea
                className="w-full bg-[#050505] border border-white/5 rounded-md p-3 text-[13px] text-[#10D9B0] font-mono h-[100px] outline-none transition-colors resize-none leading-relaxed"
                readOnly
                value={`{
  "verdict": "number (1-3)",
  "confidence": "number (0-100)",
  "reasoning": "string"
}`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white/[0.01] border border-white/5 p-5 rounded-xl space-y-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-unbounded text-sm">Smart Contract Escrow</h4>
                <span className="text-[10px] text-yellow-500/80 uppercase tracking-widest bg-yellow-500/10 px-2.5 py-1 rounded border border-yellow-500/20">
                  On-Chain
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#666]">
                    {t("taskTypeLabel")}
                  </label>
                  <div className="w-full bg-[#050505] border border-white/5 rounded-md p-3 text-sm text-white font-mono">
                    Analyze (0)
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#666]">
                    {t("validatorsLabel")}
                  </label>
                  <div className="w-full bg-[#050505] border border-white/5 rounded-md p-3 text-sm text-white font-mono">
                    3 Nodes
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#666]">{t("tierLabel")}</label>
                  <div className="w-full bg-[#050505] border border-white/5 rounded-md p-3 text-sm text-white font-mono">
                    Tier 1
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#666]">{t("rewardLabel")}</label>
                <div className="w-full flex items-center justify-between bg-[#050505] border border-white/5 rounded-md p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#8ECAE6] shadow-[0_0_10px_#8ECAE6] animate-pulse" />
                    <span className="text-lg text-[#8ECAE6] font-mono">1.5 SOL</span>
                  </div>
                  <span className="text-xs text-[#666] font-mono">1_500_000_000 lamports</span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#050505] border border-white/5 rounded-xl overflow-hidden relative flex flex-col shadow-inner">
              <div className="absolute top-0 right-0 p-3 flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <div className="bg-white/5 px-5 py-3 border-b border-white/5 flex items-center gap-2 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 256 256" fill="#8ECAE6">
                  <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z"></path>
                </svg>
                <span className="text-[#888] font-mono text-[12px]">platform/packages/sdk/dapp_integration.ts</span>
              </div>
              <div className="flex-1 overflow-auto p-5">
                <pre className="text-[13px] leading-loose text-[#A0A0A0] font-mono">
                  <span className="text-purple-400">import</span> {"{"}{" "}
                  <span className="text-yellow-200">buildManifest</span>,{" "}
                  <span className="text-yellow-200">createStorageProvider</span>, SolariumClient {"}"}{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-green-300">"@solarium-labs/sdk"</span>;
                  <span className="text-gray-500">{`// 1. Build the Off-Chain TaskManifest`}</span>
                  <span className="text-blue-400">const</span> manifest ={" "}
                  <span className="text-yellow-200">buildManifest</span>(
                  {`
  "Wash Trading Analysis",
  "analyze",
  { txId: "0x...", ... },
  promptText,
  schemaJSON
`}
                  );
                  <span className="text-gray-500">{`// 2. Upload to decentralized storage (e.g., IPFS Pinata)`}</span>
                  <span className="text-blue-400">const</span> storage ={" "}
                  <span className="text-yellow-200">createStorageProvider</span>(process.env.PINATA_JWT);
                  <span className="text-blue-400">const</span> {` { uri, hashArray }`} ={" "}
                  <span className="text-purple-400">await</span> storage.
                  <span className="text-yellow-200">uploadJson</span>(manifest);
                  <span className="text-gray-500">{`console.log("Manifest stored at:", uri);`}</span>
                  <span className="text-gray-500">{`// 3. Lock escrow and open network task on Solana Blockchain`}</span>
                  <span className="text-purple-400">await</span> client.
                  <span className="text-yellow-200">createTask</span>(
                  {`{
  inputHash: hashArray,
  taskType: TaskType.Analyze,
  tier: 1,
  reward: new BN(1500000000),
  validatorCount: 3
}`}
                  );
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-4 w-full py-4 bg-[#8ECAE6]/10 border border-[#8ECAE6]/30 hover:bg-[#8ECAE6]/20 hover:border-[#8ECAE6]/50 text-[#8ECAE6] rounded-xl font-unbounded text-sm font-medium tracking-widest uppercase transition-all duration-300 cursor-pointer active:scale-[0.99] shadow-[0_0_20px_rgba(142,202,230,0.15)] flex justify-center items-center gap-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
          <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
        </svg>
        {t("btnNext")}
      </button>
    </TutorialNode>
  );
}
