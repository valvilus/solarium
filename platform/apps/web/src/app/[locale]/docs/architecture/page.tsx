import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { CodeTerminal } from "@/components/docs/ui/CodeTerminal";
import { Intersect, Coins, Key, ShieldWarning } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Architecture | Solarium Protocol",
  description: "Protocol Architecture, Consensus, and Economics.",
};

export default function DocsArchitecture() {
  const t = useTranslations("DocsArchitecture");

  return (
    <div className="flex flex-col max-w-[700px]">
      <div className="mb-10">
        <h1 className="font-exo2 text-[2.5rem] font-bold text-white mb-2 leading-tight">{t("title")}</h1>
        <p className="font-onest text-[#A3A3A3] text-[1.1rem]">{t("subtitle")}</p>
      </div>

      <div className="p-6 border border-white/5 bg-white/[0.01] rounded-2xl mb-12 flex flex-col items-center justify-center gap-4 pointer-events-none">
        <div className="flex items-center gap-4 text-[#555]">
          <div className="w-[120px] h-[60px] border border-white/10 rounded-lg flex items-center justify-center font-mono text-[10px] uppercase">
            DApp Request
          </div>
          <span className="text-[#8BA3C0]">&rarr;</span>
          <div className="w-[120px] h-[60px] bg-white/5 border border-white/20 rounded-lg flex items-center justify-center font-mono text-[10px] uppercase text-white">
            Worker Node
          </div>
          <span className="text-[#8BA3C0]">&rarr;</span>
          <div className="flex flex-col gap-2">
            <div className="w-[120px] h-[26px] border border-[#8BA3C0]/30 rounded flex items-center justify-center font-mono text-[9px] uppercase text-[#8BA3C0]">
              Judge 01
            </div>
            <div className="w-[120px] h-[26px] border border-[#8BA3C0]/30 rounded flex items-center justify-center font-mono text-[9px] uppercase text-[#8BA3C0]">
              Judge 02
            </div>
          </div>
        </div>
      </div>

      <h2 className="font-exo2 text-[1.75rem] font-semibold text-white mb-4">{t("overviewTitle")}</h2>
      <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-4">{t("overviewDesc")}</p>

      <div className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10 mb-10">
        <span className="font-mono text-sm uppercase text-[#8BA3C0] tracking-widest">{t("programId")}</span>
        <code className="font-mono text-sm text-white">SoLaRiUm8d8d1e3yZfWvB2...</code>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Intersect weight="fill" className="text-[#8BA3C0] size-6" />
          <h2 className="font-exo2 text-[1.75rem] font-semibold text-white">{t("consensusTitle")}</h2>
        </div>
        <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-6">{t("consensusDesc")}</p>

        <div className="pl-6 border-l-2 border-[#8BA3C0]/30 space-y-6">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#8BA3C0] mb-2">Phase 1: Commit</h4>
            <p className="font-onest text-[#A3A3A3] leading-[1.7]">{t("phase1")}</p>
            <CodeTerminal language="rust" code="let commitment = hash(verdict || confidence || salt);" />
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#8BA3C0] mb-2">Phase 2: Reveal</h4>
            <p className="font-onest text-[#A3A3A3] leading-[1.7]">{t("phase2")}</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Coins weight="fill" className="text-[#8BA3C0] size-6" />
          <h2 className="font-exo2 text-[1.75rem] font-semibold text-white">{t("economicsTitle")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-white/5 bg-white/[0.02] rounded-xl flex flex-col gap-2">
            <span className="font-mono text-[#8BA3C0] text-xs uppercase tracking-widest">Staking Limits</span>
            <span className="font-onest text-white text-sm">{t("workerStake")}</span>
            <span className="font-onest text-white text-sm">{t("validatorStake")}</span>
          </div>
          <div className="p-4 border border-white/5 bg-white/[0.02] rounded-xl flex flex-col gap-2">
            <span className="font-mono text-[#8BA3C0] text-xs uppercase tracking-widest">Fee Distribution</span>
            <span className="font-onest text-white text-sm">{t("protocolFee")}</span>
            <span className="font-onest text-white text-sm">{t("workerReward")}</span>
            <span className="font-onest text-white text-sm">{t("validatorReward")}</span>
          </div>
          <div className="md:col-span-2 p-4 border border-[#FF1515]/20 bg-[#FF1515]/5 rounded-xl flex flex-col gap-2 mt-2">
            <span className="font-mono text-[#FF1515] text-xs uppercase tracking-widest flex items-center gap-2">
              <ShieldWarning weight="fill" /> Slashing Conditions
            </span>
            <span className="font-onest text-white/80 text-sm">{t("slashWrong")}</span>
            <span className="font-onest text-white/80 text-sm">{t("slashNoReveal")}</span>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Key weight="fill" className="text-[#8BA3C0] size-6" />
          <h2 className="font-exo2 text-[1.75rem] font-semibold text-white">{t("pdaTitle")}</h2>
        </div>
        <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-6">{t("pdaDesc")}</p>
        <div className="grid gap-2 font-mono text-[13px] text-[#A3A3A3]">
          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
            <span className="text-white min-w-[80px]">Node</span> <code>["node", wallet_pubkey]</code>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
            <span className="text-white min-w-[80px]">Task</span> <code>["task", task_id]</code>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
            <span className="text-white min-w-[80px]">Vault</span> <code>["vault", node_pubkey]</code>
          </div>
        </div>
      </div>

      <div className="mt-16 w-full h-[1px] bg-white/5" />
      <div className="mt-8 flex justify-between">
        <a href="/docs/quickstart" className="flex flex-col items-start group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Previous</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            &larr; Quickstart
          </span>
        </a>
        <a href="/docs/sdk" className="flex flex-col items-end group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Next</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            SDK Reference &rarr;
          </span>
        </a>
      </div>
    </div>
  );
}
