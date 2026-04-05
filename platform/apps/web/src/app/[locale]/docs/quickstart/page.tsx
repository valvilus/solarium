import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { CodeTerminal } from "@/components/docs/ui/CodeTerminal";
import { DownloadSimple, ShieldCheck, Browser, Rocket } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Quickstart | Solarium Protocol",
  description: "Submit your first verifiable AI inference task on Solana in under 5 minutes.",
};

export default function DocsQuickstart() {
  const t = useTranslations("DocsQuickstart");

  return (
    <div className="flex flex-col max-w-[700px]">
      <div className="mb-10">
        <h1 className="font-exo2 text-[2.5rem] font-bold text-white mb-2 leading-tight">{t("title")}</h1>
        <p className="font-onest text-[#A3A3A3] text-[1.1rem]">{t("subtitle")}</p>
      </div>

      <div className="space-y-16">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8BA3C0]">
              <DownloadSimple weight="bold" size={20} />
            </div>
            <h2 className="font-exo2 text-[1.5rem] font-semibold text-white">{t("step1Title")}</h2>
          </div>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-4 ml-14">{t("step1Desc")}</p>
          <div className="ml-14">
            <CodeTerminal language="bash" code="npm install @solarium-labs/sdk @project-serum/anchor @solana/web3.js" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8BA3C0]">
              <Browser weight="bold" size={20} />
            </div>
            <h2 className="font-exo2 text-[1.5rem] font-semibold text-white">{t("step2Title")}</h2>
          </div>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-4 ml-14">{t("step2Desc")}</p>
          <div className="ml-14">
            <CodeTerminal
              language="typescript"
              code={`import { SolariumClient } from '@solarium-labs/sdk';
import { AnchorProvider, Wallet } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';

const connection = new Connection("https://api.devnet.solana.com");
const provider = new AnchorProvider(connection, wallet, {});


const client = new SolariumClient(provider);`}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8BA3C0]">
              <Rocket weight="bold" size={20} />
            </div>
            <h2 className="font-exo2 text-[1.5rem] font-semibold text-white">{t("step3Title")}</h2>
          </div>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-4 ml-14">{t("step3Desc")}</p>
          <div className="ml-14">
            <CodeTerminal
              language="typescript"
              code={`// Submit a task with a prompt and escrow budget
const taskId = await client.createTask({
  tier: "LLAMA_3_70B",
  prompt: "Verify the authenticity of this payload: { data: 'X' }",
  budget: 0.05,
});

console.log("Task submitted successfully:", taskId);`}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8BA3C0]">
              <ShieldCheck weight="bold" size={20} />
            </div>
            <h2 className="font-exo2 text-[1.5rem] font-semibold text-white">{t("step4Title")}</h2>
          </div>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-4 ml-14">{t("step4Desc")}</p>
          <div className="ml-14">
            <CodeTerminal
              language="typescript"
              code={`// Await the network's consensus via Optimistic Finality
const result = await client.pollTaskFinality(taskId);

console.log("Network Verdict:", result.verdict);
console.log("Confidence Score:", result.confidence);

if (result.confidence > 90) {

}`}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 w-full h-[1px] bg-white/5" />

      <div className="mt-8 flex justify-end">
        <a href="/docs/architecture" className="flex flex-col items-end group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Next Category</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            Architecture &rarr;
          </span>
        </a>
      </div>
    </div>
  );
}
