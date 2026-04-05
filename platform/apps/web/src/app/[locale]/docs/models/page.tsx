import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Robot, Memory, Lightning } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Models | Solarium Protocol",
  description: "Supported AI models and deterministic limits.",
};

export default function DocsModels() {
  const t = useTranslations("DocsModels");

  return (
    <div className="flex flex-col max-w-[700px]">
      <div className="mb-10">
        <h1 className="font-exo2 text-[2.5rem] font-bold text-white mb-2 leading-tight">{t("title")}</h1>
        <p className="font-onest text-[#A3A3A3] text-[1.1rem]">{t("subtitle")}</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 border border-[#8BA3C0]/30 bg-[#8BA3C0]/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white shrink-0">
              <Robot weight="fill" size={24} />
            </div>
            <div>
              <h3 className="font-exo2 text-xl font-bold text-white mb-1">Llama 3 70B</h3>
              <p className="font-onest text-sm text-[#A3A3A3]">{t("llamaLevel")}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-widest text-[#A3A3A3]">
            <div className="flex items-center gap-2">
              <Memory className="text-[#8BA3C0] size-4" /> {t("llamaContext")}
            </div>
            <div className="flex items-center gap-2">
              <Lightning className="text-[#8BA3C0] size-4" /> {t("llamaTime")}
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/5 bg-white/[0.02] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white shrink-0">
              <Robot weight="fill" size={24} />
            </div>
            <div>
              <h3 className="font-exo2 text-xl font-bold text-white mb-1">Mixtral 8x7B</h3>
              <p className="font-onest text-sm text-[#A3A3A3]">{t("mixtralLevel")}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-widest text-[#A3A3A3]">
            <div className="flex items-center gap-2">
              <Memory className="text-[#8BA3C0] size-4" /> {t("mixtralContext")}
            </div>
            <div className="flex items-center gap-2">
              <Lightning className="text-[#8BA3C0] size-4" /> {t("mixtralTime")}
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/5 bg-white/[0.02] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white shrink-0">
              <Robot weight="fill" size={24} />
            </div>
            <div>
              <h3 className="font-exo2 text-xl font-bold text-white mb-1">{t("gptTitle")}</h3>
              <p className="font-onest text-sm text-[#A3A3A3]">{t("gptLevel")}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-widest text-[#A3A3A3]">
            <div className="flex items-center gap-2">
              <Memory className="text-[#8BA3C0] size-4" /> {t("gptContext")}
            </div>
            <div className="flex items-center gap-2">
              <Lightning className="text-[#8BA3C0] size-4" /> {t("gptTime")}
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/5 bg-white/[0.02] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white shrink-0">
              <Robot weight="fill" size={24} />
            </div>
            <div>
              <h3 className="font-exo2 text-xl font-bold text-white mb-1">{t("geminiTitle")}</h3>
              <p className="font-onest text-sm text-[#A3A3A3]">{t("geminiLevel")}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-widest text-[#A3A3A3]">
            <div className="flex items-center gap-2">
              <Memory className="text-[#8BA3C0] size-4" /> {t("geminiContext")}
            </div>
            <div className="flex items-center gap-2">
              <Lightning className="text-[#8BA3C0] size-4" /> {t("geminiTime")}
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/5 bg-white/[0.02] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white shrink-0">
              <Robot weight="fill" size={24} />
            </div>
            <div>
              <h3 className="font-exo2 text-xl font-bold text-white mb-1">{t("claudeTitle")}</h3>
              <p className="font-onest text-sm text-[#A3A3A3]">{t("claudeLevel")}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-widest text-[#A3A3A3]">
            <div className="flex items-center gap-2">
              <Memory className="text-[#8BA3C0] size-4" /> {t("claudeContext")}
            </div>
            <div className="flex items-center gap-2">
              <Lightning className="text-[#8BA3C0] size-4" /> {t("claudeTime")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 w-full h-[1px] bg-white/5" />
      <div className="mt-8 flex justify-between">
        <a href="/docs/sdk" className="flex flex-col items-start group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Previous</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            &larr; SDK Reference
          </span>
        </a>
        <a href="/docs/nodes/worker" className="flex flex-col items-end group">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">Next Category</span>
          <span className="font-exo2 text-lg text-white group-hover:text-[#8BA3C0] transition-colors flex items-center gap-2">
            Worker Nodes &rarr;
          </span>
        </a>
      </div>
    </div>
  );
}
