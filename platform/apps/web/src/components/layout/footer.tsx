"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function Footer(): JSX.Element {
  const t = useTranslations("Footer");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return (
    <footer className="w-full bg-[#050505] relative overflow-hidden pt-0">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, rgba(72, 149, 239, 0.05) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle at bottom right, rgba(23, 12, 0, 0.8) 0%, transparent 60%)" }}
      />

      <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-12 pt-10 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          <div className="lg:col-span-2 flex flex-col items-start pr-8">
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-6 group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                className="group-hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <path d="M16 3 L28 9.5 L16 16 L4 9.5 Z" fill="#FFFFFF" fillOpacity="0.15" />
                <path d="M4 10.5 L15.5 16.8 V29 L4 22.5 Z" fill="#FFFFFF" fillOpacity="0.5" />
                <path d="M28 10.5 L16.5 16.8 V29 L28 22.5 Z" fill="#FFFFFF" />
              </svg>
              <span className="font-unbounded font-medium tracking-[0.2em] uppercase text-white/90 text-[13px] mt-[1px]">
                Solarium
              </span>
            </Link>
            <p className="font-onest text-[#777] text-[14.5px] leading-[1.8] max-w-sm mb-8">{t("desc")}</p>

            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10D9B0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10D9B0]"></span>
              </span>
              <span className="font-mono text-[9.5px] uppercase tracking-widest text-[#888]">{t("operational")}</span>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/40 mb-2">{t("ecosystem")}</h4>
            <Link
              href={`/${locale}/dashboard`}
              className="font-onest text-[14.5px] text-[#A3A3A3] hover:text-white transition-colors duration-300 w-fit"
            >
              {t("dashboard")}
            </Link>
            <Link
              href={`/${locale}/explorer`}
              className="font-onest text-[14.5px] text-[#A3A3A3] hover:text-white transition-colors duration-300 w-fit"
            >
              {t("explorer")}
            </Link>
            <Link
              href={`/${locale}/docs/nodes`}
              className="font-onest text-[14.5px] text-[#A3A3A3] hover:text-white transition-colors duration-300 w-fit"
            >
              {t("nodes")}
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/40 mb-2">{t("developers")}</h4>
            <Link
              href={`/${locale}/docs`}
              className="font-onest text-[14.5px] text-[#A3A3A3] hover:text-white transition-colors duration-300 w-fit"
            >
              {t("docs")}
            </Link>
            <Link
              href="https://github.com/valvilus/solarium-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="font-onest text-[14.5px] text-[#A3A3A3] hover:text-white transition-colors duration-300 w-fit"
            >
              {t("whitepaper")}
            </Link>
            <Link
              href="https://github.com/valvilus/solarium-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="font-onest text-[14.5px] text-[#A3A3A3] hover:text-white transition-colors duration-300 w-fit"
            >
              {t("github")}
            </Link>
            <Link
              href={`/${locale}/docs/sdk`}
              className="font-onest text-[14.5px] text-[#A3A3A3] hover:text-white transition-colors duration-300 w-fit"
            >
              {t("sdk")}
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/40 mb-2">{t("community")}</h4>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-onest text-[14.5px] text-[#A3A3A3] hover:text-white transition-colors duration-300 w-fit"
            >
              {t("twitter")}
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-onest text-[14.5px] text-[#A3A3A3] hover:text-white transition-colors duration-300 w-fit"
            >
              {t("discord")}
            </a>
            <a
              href="https://telegram.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-onest text-[14.5px] text-[#A3A3A3] hover:text-white transition-colors duration-300 w-fit"
            >
              {t("telegram")}
            </a>
            <a
              href="#"
              className="font-onest text-[14.5px] text-[#A3A3A3] hover:text-white transition-colors duration-300 w-fit"
            >
              {t("blog")}
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#555]">{t("copyright")}</p>
          <div className="flex items-center gap-8">
            <Link
              href="#"
              className="font-mono text-[10px] uppercase tracking-widest text-[#555] hover:text-white transition-colors duration-300"
            >
              {t("privacy")}
            </Link>
            <Link
              href="#"
              className="font-mono text-[10px] uppercase tracking-widest text-[#555] hover:text-white transition-colors duration-300"
            >
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
