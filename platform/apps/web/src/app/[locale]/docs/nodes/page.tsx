import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { CodeTerminal } from "@/components/docs/ui/CodeTerminal";
import { HardDrives, TerminalWindow, Coins, ShieldCheck, Cpu } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Node Guide | Solarium Protocol",
  description: "Run a Worker or Validator node to participate in verifiable AI consensus.",
};

export default function DocsNodeGuide() {
  const t = useTranslations("DocsNodeGuide");

  return (
    <div className="flex flex-col max-w-[700px]">
      <div className="mb-10">
        <h1 className="font-exo2 text-[2.5rem] font-bold text-white mb-2 leading-tight">{t("title")}</h1>
        <p className="font-onest text-[#A3A3A3] text-[1.1rem]">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="p-5 border border-[#8BA3C0]/20 bg-[#8BA3C0]/5 rounded-xl group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-[#8BA3C0] group-hover:scale-110 transition-transform">
            <HardDrives size={64} weight="fill" />
          </div>
          <h3 className="font-exo2 font-semibold text-white mb-2 relative z-10">{t("workerTitle")}</h3>
          <p className="font-onest text-sm text-[#A3A3A3] leading-[1.6] relative z-10">{t("workerDesc")}</p>
        </div>
        <div className="p-5 border border-white/10 bg-white/[0.02] rounded-xl group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-white group-hover:scale-110 transition-transform">
            <ShieldCheck size={64} weight="fill" />
          </div>
          <h3 className="font-exo2 font-semibold text-white mb-2 relative z-10">{t("validatorTitle")}</h3>
          <p className="font-onest text-sm text-[#A3A3A3] leading-[1.6] relative z-10">{t("validatorDesc")}</p>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Cpu weight="fill" className="text-[#8BA3C0] size-6" />
            <h2 className="font-exo2 text-[1.75rem] font-semibold text-white">{t("prereqTitle")}</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[13px] text-[#A3A3A3]">
            <li className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8BA3C0]" /> {t("prereq1")}
            </li>
            <li className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8BA3C0]" /> {t("prereq2")}
            </li>
            <li className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8BA3C0]" /> {t("prereq3")}
            </li>
            <li className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8BA3C0]" /> {t("prereq4")}
            </li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <TerminalWindow weight="fill" className="text-[#8BA3C0] size-6" />
            <h2 className="font-exo2 text-[1.75rem] font-semibold text-white">{t("configTitle")}</h2>
          </div>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-4">{t("configDesc")}</p>
          <CodeTerminal
            language="env"
            code={`# Node Environment Variables
WALLET_PATH=~/.config/solana/id.json
RPC_URL=https://api.mainnet-beta.solana.com

# Node Role (worker | validator)
NODE_ROLE=worker

# Inference Provider Keys
GEMINI_API_KEY=aizaSy...`}
          />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <HardDrives weight="fill" className="text-[#8BA3C0] size-6" />
            <h2 className="font-exo2 text-[1.75rem] font-semibold text-white">Start the Agent</h2>
          </div>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-4">
            Run the robust Solarium Rust/TS agent to start monitoring the blockchain state. The agent will automatically
            claim tasks it is eligible for based on its role.
          </p>
          <CodeTerminal language="bash" code={`npm run start:agent`} />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Coins weight="fill" className="text-[#8BA3C0] size-6" />
            <h2 className="font-exo2 text-[1.75rem] font-semibold text-white">{t("earningsTitle")}</h2>
          </div>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-6">{t("earningsDesc")}</p>
        </section>
      </div>

      <div className="mt-16 w-full h-[1px] bg-white/5" />
      <div className="mt-8 flex justify-start">
        <a href="/docs/sdk" className="flex flex-col items-start group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Previous</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            &larr; SDK Reference
          </span>
        </a>
      </div>
    </div>
  );
}
