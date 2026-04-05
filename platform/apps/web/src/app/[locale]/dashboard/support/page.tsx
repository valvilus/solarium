"use client";

import { useTranslations } from "next-intl";
import { TelegramLogo, EnvelopeSimple, BookOpen, Bug } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SupportPage() {
  const t = useTranslations("DashboardSupport");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return (
    <div className="w-full flex-col animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2 mb-8 border-b border-white/5 pb-8">
        <h1 className="text-3xl font-exo2 font-semibold text-white tracking-tight">{t("title")}</h1>
        <span className="text-[#777] font-onest">{t("description")}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        <a
          href="https://t.me/webdeveloperkz"
          target="_blank"
          rel="noreferrer"
          className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-start gap-5 hover:bg-white/[0.02] hover:border-[#38BDF8]/30 transition-all group"
        >
          <div className="p-3 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-xl group-hover:scale-110 transition-transform">
            <TelegramLogo weight="fill" className="text-[#38BDF8] size-6" />
          </div>
          <div>
            <h3 className="font-exo2 text-white font-semibold text-lg mb-1 group-hover:text-[#38BDF8] transition-colors">
              {t("tgCard")}
            </h3>
            <span className="text-sm font-onest text-[#777] block mb-3">{t("tgDesc")}</span>
            <span className="font-mono text-xs text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-1 rounded">@webdeveloperkz</span>
          </div>
        </a>

        <a
          href="mailto:danial221005@gmail.com"
          className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-start gap-5 hover:bg-white/[0.02] hover:border-[#10D9B0]/30 transition-all group"
        >
          <div className="p-3 bg-[#10D9B0]/10 border border-[#10D9B0]/20 rounded-xl group-hover:scale-110 transition-transform">
            <EnvelopeSimple weight="fill" className="text-[#10D9B0] size-6" />
          </div>
          <div>
            <h3 className="font-exo2 text-white font-semibold text-lg mb-1 group-hover:text-[#10D9B0] transition-colors">
              {t("mailCard")}
            </h3>
            <span className="text-sm font-onest text-[#777] block mb-3">{t("mailDesc")}</span>
            <span className="font-mono text-xs text-[#10D9B0] bg-[#10D9B0]/10 px-2 py-1 rounded">
              danial221005@gmail.com
            </span>
          </div>
        </a>

        <Link
          href={`/${locale}/docs`}
          className="bg-[#050505] border border-white/5 p-6 rounded-2xl flex items-start gap-5 hover:bg-white/[0.02] transition-colors col-span-1 md:col-span-2 group"
        >
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:scale-110 transition-transform">
            <BookOpen weight="fill" className="text-white size-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-exo2 text-white font-semibold text-lg mb-1">{t("docsCard")}</h3>
            <span className="text-sm font-onest text-[#777] block">{t("docsDesc")}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
