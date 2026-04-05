"use client";

import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ParticlesBackground } from "@/components/ui/particles-background";

const BLUR_UP: Variants = {
  hidden: { y: 40, opacity: 0, filter: "blur(10px)" },
  visible: (delay: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

const STAT_KEYS = [
  { value: "stat1Value", label: "stat1Label" },
  { value: "stat2Value", label: "stat2Label" },
  { value: "stat3Value", label: "stat3Label" },
  { value: "stat4Value", label: "stat4Label" },
] as const;

import { usePathname } from "next/navigation";

export function HeroSection() {
  const t = useTranslations("HeroAwwwards");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const pillars = [92, 84, 78, 70, 62, 54, 46, 34, 18, 34, 46, 54, 62, 70, 78, 84, 92];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes subtlePulse {
            0%, 100% { opacity: 0.5; transform: translateX(-50%); }
            50% { opacity: 0.8; transform: translateX(-50%); }
          }
        `}
      </style>
      <section className="relative w-full min-h-[100vh] flex flex-col justify-center overflow-hidden bg-black selection:bg-white/20">
        <div
          aria-hidden
          className="absolute inset-0 z-[0] pointer-events-none blur-[60px] opacity-25"
          style={{
            backgroundImage: [
              "radial-gradient(120% 90% at 50% 60%, rgba(252,166,154,0.2) 0%, rgba(214,76,82,0.2) 30%, rgba(61,36,47,0.15) 50%, rgba(39,38,67,0.2) 65%, rgba(8,8,12,0.8) 85%, rgba(0,0,0,1) 95%)",
              "radial-gradient(100% 80% at 14% 0%, rgba(255,193,171,0.2) 0%, rgba(233,109,99,0.2) 30%, rgba(48,24,28,0.0) 64%)",
              "radial-gradient(100% 80% at 86% 22%, rgba(88,112,255,0.2) 0%, rgba(16,18,28,0.0) 55%)",
              "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0) 40%)",
            ].join(","),
            backgroundColor: "#000",
          }}
        />

        <ParticlesBackground />

        <div
          aria-hidden
          className="absolute inset-0 z-[2] pointer-events-none bg-[radial-gradient(160%_150%_at_50%_30%,transparent_60%,rgba(0,0,0,0.9))]"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] mix-blend-screen opacity-50"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 96px)",
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 24px)",
              "repeating-radial-gradient(80% 55% at 50% 52%, rgba(255,255,255,0.06) 0 1px, transparent 1px 120px)",
            ].join(","),
            backgroundBlendMode: "screen",
          }}
        />

        <div
          className="pointer-events-none absolute bottom-[100px] left-1/2 z-[3] h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-b from-white/20 via-rose-300/10 to-transparent blur-3xl mix-blend-screen"
          style={{ animation: "subtlePulse 6s ease-in-out infinite" }}
        />

        <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] backdrop-blur-[2px] opacity-70" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[40vh] flex flex-col justify-end">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
        </div>

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12 pt-[180px] pb-32 flex flex-col items-center text-center">
          <motion.h1
            className="font-exo2 font-bold uppercase text-white tracking-widest leading-[1.2] text-[clamp(2rem,3.5vw,3.5rem)] max-w-[20ch]"
            variants={BLUR_UP}
            initial="hidden"
            animate="visible"
            custom={0.15}
          >
            {t("title1")} <br className="hidden sm:block" />
            {t("title2")} <br className="hidden sm:block" />
            <span className="text-white/70">{t("title3")}</span>
          </motion.h1>

          <motion.p
            className="mt-6 lg:mt-6 max-w-[640px] font-onest font-light text-neutral-400 text-[clamp(1rem,1.1vw,1.1rem)] leading-[1.7]"
            variants={BLUR_UP}
            initial="hidden"
            animate="visible"
            custom={0.35}
          >
            {t("description")}
          </motion.p>

          <motion.div
            className="mt-10 lg:mt-10 flex flex-wrap items-center justify-center gap-4"
            variants={BLUR_UP}
            initial="hidden"
            animate="visible"
            custom={0.5}
          >
            <Link
              href={`/${locale}/dashboard`}
              className="group relative inline-flex items-center justify-center rounded-full bg-white py-4 px-8 text-black transition-all duration-500 hover:bg-white/90"
            >
              <span className="font-outfit font-medium uppercase tracking-[0.12em] text-[13px]">{t("button")}</span>
              <svg
                className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path d="M11.003 3.414L2.397 12.021.982 10.607 9.589 2H2.003V0h11v11h-2V3.414Z" fill="currentColor" />
              </svg>
            </Link>
            <Link
              href={`/${locale}/docs`}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 py-4 px-8 text-white/70 backdrop-blur-md transition-all duration-500 hover:border-white/30 hover:text-white"
            >
              <span className="font-outfit font-medium uppercase tracking-[0.12em] text-[13px]">
                {t("buttonSecondary")}
              </span>
            </Link>
          </motion.div>

          <motion.div
            className="mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 w-full gap-0 border-t border-white/[0.08]"
            variants={BLUR_UP}
            initial="hidden"
            animate="visible"
            custom={0.7}
          >
            {STAT_KEYS.map((stat, idx) => (
              <div
                key={idx}
                className={`py-8 lg:py-10 text-center lg:text-left ${idx > 0 ? "border-l border-white/[0.08]" : ""} ${idx === 2 ? "border-t border-white/[0.08] lg:border-t-0" : ""} ${idx === 3 ? "border-t border-white/[0.08] lg:border-t-0" : ""} pl-0 ${idx > 0 ? "pl-0 lg:pl-8" : ""}`}
              >
                <p className="font-exo2 font-bold text-white text-[clamp(1.5rem,2.5vw,2.5rem)] uppercase leading-none tracking-wider">
                  {t(stat.value)}
                </p>
                <p className="mt-2 text-neutral-500 font-mono text-[12px] uppercase tracking-[0.1em] font-medium">
                  {t(stat.label)}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
