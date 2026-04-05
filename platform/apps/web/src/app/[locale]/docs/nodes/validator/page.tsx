import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { ShieldCheck, Scales, Broadcast, Robot, LinkSimple } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Validator Node | Solarium Protocol",
  description: "Setup your LLM-as-a-Judge infrastructure.",
};

export default function DocsValidatorGuide() {
  const t = useTranslations("DocsValidatorGuide");

  return (
    <div className="flex flex-col max-w-[700px]">
      <div className="mb-10">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8BA3C0] mb-6">
          <ShieldCheck weight="fill" size={32} />
        </div>
        <h1 className="font-exo2 text-[2.5rem] font-bold text-white mb-2 leading-tight">{t("title")}</h1>
        <p className="font-onest text-[#A3A3A3] text-[1.1rem]">{t("subtitle")}</p>
      </div>

      <div className="space-y-12">
        <section>
          <div className="p-6 border border-[#FF3366]/20 bg-[#FF3366]/5 rounded-xl">
            <h3 className="font-exo2 font-semibold text-white flex items-center gap-2 mb-3">
              <Scales className="text-[#FF3366]" weight="fill" /> {t("crucialTitle")}
            </h3>
            <p className="font-onest text-[#A3A3A3] text-sm leading-[1.6]">{t("crucialDesc")}</p>
          </div>
        </section>

        <section>
          <h2 className="font-exo2 text-[1.75rem] font-semibold text-white mb-6">{t("evalTitle")}</h2>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-4">{t("evalDesc")}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            <div className="border border-white/10 bg-white/5 rounded p-3 flex flex-col items-center gap-1">
              <LinkSimple className="text-[#555]" />{" "}
              <span className="font-mono text-[10px] text-white text-center">{t("stepParse")}</span>
            </div>
            <div className="border border-white/10 bg-white/5 rounded p-3 flex flex-col items-center gap-1">
              <Robot className="text-[#555]" />{" "}
              <span className="font-mono text-[10px] text-white text-center">{t("stepGen")}</span>
            </div>
            <div className="border border-white/10 bg-white/5 rounded p-3 flex flex-col items-center gap-1">
              <Robot className="text-[#555]" />{" "}
              <span className="font-mono text-[10px] text-white text-center">{t("stepCompare")}</span>
            </div>
            <div className="border border-white/10 bg-white/5 rounded p-3 flex flex-col items-center gap-1">
              <Broadcast className="text-[#8BA3C0]" />{" "}
              <span className="font-mono text-[10px] text-white text-center">{t("stepBroadcast")}</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-exo2 text-[1.75rem] font-semibold text-white mb-4">{t("slashTitle")}</h2>
          <p className="font-onest text-[#A3A3A3] leading-[1.8]">{t("slashDesc")}</p>
        </section>
      </div>

      <div className="mt-16 w-full h-[1px] bg-white/5" />
      <div className="mt-8 flex justify-start">
        <a href="/docs/nodes/worker" className="flex flex-col items-start group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Previous</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            &larr; Worker Node
          </span>
        </a>
      </div>
    </div>
  );
}
