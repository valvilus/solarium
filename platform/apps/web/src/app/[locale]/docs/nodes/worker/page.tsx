import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { HardDrives, DownloadSimple, Wallet, LinkSimple } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Worker Node | Solarium Protocol",
  description: "Set up and operate a Worker Node to earn SOL.",
};

export default function DocsWorkerGuide() {
  const t = useTranslations("DocsWorkerGuide");

  return (
    <div className="flex flex-col max-w-[700px]">
      <div className="mb-10">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8BA3C0] mb-6">
          <HardDrives weight="fill" size={32} />
        </div>
        <h1 className="font-exo2 text-[2.5rem] font-bold text-white mb-2 leading-tight">{t("title")}</h1>
        <p className="font-onest text-[#A3A3A3] text-[1.1rem]">{t("subtitle")}</p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="font-exo2 text-[1.75rem] font-semibold text-white mb-6">{t("hwTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border border-white/5 bg-white/[0.02] rounded-xl flex items-start gap-4 h-full">
              <DownloadSimple className="text-[#8BA3C0] size-6 shrink-0 mt-1" />
              <div>
                <div className="flex items-center gap-2 mb-2 text-white font-semibold font-exo2">{t("vramTitle")}</div>
                <p className="font-onest text-sm text-[#A3A3A3] leading-[1.6]">{t("vramDesc")}</p>
              </div>
            </div>
            <div className="p-5 border border-white/5 bg-white/[0.02] rounded-xl flex items-start gap-4 h-full">
              <Wallet className="text-[#8BA3C0] size-6 shrink-0 mt-1" />
              <div>
                <div className="flex items-center gap-2 mb-2 text-white font-semibold font-exo2">{t("ramTitle")}</div>
                <p className="font-onest text-sm text-[#A3A3A3] leading-[1.6]">{t("ramDesc")}</p>
              </div>
            </div>
            <div className="md:col-span-2 p-5 mt-4 border border-white/5 bg-white/[0.02] rounded-xl flex items-start gap-4">
              <LinkSimple className="text-[#8BA3C0] size-6 shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-semibold font-exo2 mb-1">{t("fallbackTitle")}</h4>
                <p className="font-onest text-sm text-[#A3A3A3] leading-[1.6]">{t("fallbackDesc")}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-exo2 text-[1.75rem] font-semibold text-white mb-6">{t("regTitle")}</h2>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-4">{t("regDesc")}</p>
          <div className="w-full h-[180px] rounded-xl bg-[url('/grid-pattern.svg')] bg-[#050505] border border-white/10 flex items-center justify-center mb-6">
            <span className="font-onest text-[#555] uppercase tracking-widest text-xs">PAIRING UI MOCKUP</span>
          </div>
        </section>

        <section>
          <h2 className="font-exo2 text-[1.75rem] font-semibold text-white mb-6">{t("execTitle")}</h2>
          <p className="font-onest text-[#A3A3A3] leading-[1.8] mb-4">{t("execDesc")}</p>
        </section>
      </div>

      <div className="mt-16 w-full h-[1px] bg-white/5" />
      <div className="mt-8 flex justify-between">
        <a href="/docs/models" className="flex flex-col items-start group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Previous Category</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            &larr; Models
          </span>
        </a>
        <a href="/docs/nodes/validator" className="flex flex-col items-end group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Next</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            Validator Judge &rarr;
          </span>
        </a>
      </div>
    </div>
  );
}
