import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { CodeTerminal } from "@/components/docs/ui/CodeTerminal";
import { LinkSimple } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Introduction | Solarium Protocol",
  description: "Introduction to the Solarium architecture.",
};

export default function DocsIntroduction() {
  const t = useTranslations("DocsHub");

  return (
    <div className="flex flex-col max-w-[700px]">
      <div className="mb-4">
        <h1 className="font-exo2 text-[2.5rem] font-bold text-white mb-2 leading-tight">{t("title")}</h1>
        <p className="font-onest text-[#A3A3A3] text-[1.1rem]">{t("subtitle")}</p>
      </div>

      <div className="w-full h-[1px] bg-white/5 my-10" />

      <h2 className="font-exo2 text-[1.75rem] font-semibold text-white mb-6 flex items-center group cursor-text">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -ml-8 text-[#555] pointer-events-none">
          <LinkSimple weight="bold" />
        </span>
        {t("quickstartTitle")}
      </h2>
      <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-6">{t("quickstartDesc")}</p>

      <CodeTerminal language="bash" code={`npm install @solarium-labs/sdk @project-serum/anchor`} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <a
          href="/docs/architecture"
          className="p-5 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-colors group"
        >
          <h3 className="font-exo2 font-semibold text-white mb-2 group-hover:text-[#8BA3C0] transition-colors">
            {t("architectureTitle")}
          </h3>
          <p className="font-onest text-sm text-[#777] leading-[1.6]">{t("architectureDesc")}</p>
        </a>
        <a
          href="/docs/sdk"
          className="p-5 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-colors group"
        >
          <h3 className="font-exo2 font-semibold text-white mb-2 group-hover:text-[#8BA3C0] transition-colors">
            {t("sdkTitle")}
          </h3>
          <p className="font-onest text-sm text-[#777] leading-[1.6]">{t("sdkDesc")}</p>
        </a>
      </div>

      <div className="w-full h-[1px] bg-white/5 my-10" />

      <h2 className="font-exo2 text-[1.75rem] font-semibold text-white mb-6">{t("nodeGuideTitle")}</h2>
      <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-6">{t("nodeGuideDesc")}</p>

      <a
        href="/docs/nodes"
        className="flex items-center gap-4 p-5 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] transition-colors group"
      >
        <div className="w-10 h-10 bg-[#0A0A0A] border border-white/10 rounded-lg flex items-center justify-center">
          <span className="font-mono text-[#555] group-hover:text-[#8BA3C0] transition-colors">CLI</span>
        </div>
        <div>
          <h3 className="font-exo2 font-semibold text-white mb-1 group-hover:text-[#8BA3C0] transition-colors">
            Setup a Node
          </h3>
          <p className="font-onest text-sm text-[#777]">Run a worker or validator agent.</p>
        </div>
      </a>
    </div>
  );
}
