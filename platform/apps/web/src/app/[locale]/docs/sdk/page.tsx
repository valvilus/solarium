import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { CodeTerminal } from "@/components/docs/ui/CodeTerminal";
import { Wrench, TreeStructure, BracketsCurly } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "SDK Reference | Solarium Protocol",
  description: "Complete TypeScript API for @solarium-labs/sdk.",
};

export default function DocsSdk() {
  const t = useTranslations("DocsSdk");

  return (
    <div className="flex flex-col max-w-[700px]">
      <div className="mb-10">
        <h1 className="font-exo2 text-[2.5rem] font-bold text-white mb-2 leading-tight">{t("title")}</h1>
        <p className="font-onest text-[#A3A3A3] text-[1.1rem]">{t("subtitle")}</p>
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Wrench weight="fill" className="text-[#8BA3C0] size-6" />
            <h2 className="font-exo2 text-[1.75rem] font-semibold text-white">{t("clientTitle")}</h2>
          </div>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-6">{t("clientDesc")}</p>
          <CodeTerminal
            language="typescript"
            code={`import { SolariumClient } from '@solarium-labs/sdk';
import { AnchorProvider } from '@project-serum/anchor';

const client = new SolariumClient(provider, {
  commitment: "confirmed",
  rpcUrl: "https://api.mainnet-beta.solana.com"
});`}
          />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <BracketsCurly weight="fill" className="text-[#8BA3C0] size-6" />
            <h2 className="font-exo2 text-[1.75rem] font-semibold text-white">{t("methodsTitle")}</h2>
          </div>

          <div className="space-y-4">
            <div className="border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden">
              <div className="border-b border-white/5 bg-white/[0.02] px-4 py-3 font-mono text-[13px] text-[#8BA3C0]">
                createTask(config: TaskConfig): Promise&lt;string&gt;
              </div>
              <div className="p-4 font-onest text-[#A3A3A3] text-sm leading-[1.7]">{t("submitsTask")}</div>
            </div>

            <div className="border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden">
              <div className="border-b border-white/5 bg-white/[0.02] px-4 py-3 font-mono text-[13px] text-[#8BA3C0]">
                registerNode(role: NodeRole, stakeAmount: number): Promise&lt;string&gt;
              </div>
              <div className="p-4 font-onest text-[#A3A3A3] text-sm leading-[1.7]">{t("registersNode")}</div>
            </div>

            <div className="border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden">
              <div className="border-b border-white/5 bg-white/[0.02] px-4 py-3 font-mono text-[13px] text-[#8BA3C0]">
                claimTask(taskId: string): Promise&lt;string&gt;
              </div>
              <div className="p-4 font-onest text-[#A3A3A3] text-sm leading-[1.7]">{t("claimsTask")}</div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <TreeStructure weight="fill" className="text-[#8BA3C0] size-6" />
            <h2 className="font-exo2 text-[1.75rem] font-semibold text-white">{t("helpersTitle")}</h2>
          </div>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-6">{t("helpersDesc")}</p>
          <CodeTerminal
            language="typescript"
            code={`import { deriveTaskPDA, computeCommitmentHash } from '@solarium-labs/sdk';


const [taskPda, bump] = deriveTaskPDA(taskId, programId);

const hash = computeCommitmentHash(verdict, confidence, secretSalt);`}
          />
        </section>
      </div>

      <div className="mt-16 w-full h-[1px] bg-white/5" />
      <div className="mt-8 flex justify-between">
        <a href="/docs/architecture" className="flex flex-col items-start group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Previous</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            &larr; Architecture
          </span>
        </a>
        <a href="/docs/nodes" className="flex flex-col items-end group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Next</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            Node Guide &rarr;
          </span>
        </a>
      </div>
    </div>
  );
}
