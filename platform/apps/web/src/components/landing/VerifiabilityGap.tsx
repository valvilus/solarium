"use client";

import { motion } from "framer-motion";
import { Link, Database, ShieldWarning, Sparkle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

export function VerifiabilityGap() {
  const t = useTranslations("VerifiabilityGap");

  return (
    <section
      id="problem"
      className="relative w-full py-24 lg:py-32 bg-[#050505] overflow-hidden font-sans border-t border-white/5"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_10%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col gap-16 lg:gap-24">
        <div className="flex flex-col items-center text-center gap-6 max-w-[800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]"
          >
            <Link weight="bold" className="w-4 h-4 text-[#A3A3A3]" />
            <span className="font-onest text-[11px] font-semibold uppercase tracking-widest text-[#A3A3A3]">
              {t("badge")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-exo2 text-4xl lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-wide"
          >
            {t("title1")} <br className="hidden md:block" />
            <span className="text-white/40">{t("title2")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-onest text-lg lg:text-xl text-[#888888] leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative flex flex-col p-8 lg:p-10 bg-[#070707] border border-white/[0.05] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden transition-all hover:bg-[#090909] hover:border-white/10"
            style={{
              borderTopLeftRadius: "32px",
              borderBottomRightRadius: "32px",
              borderTopRightRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderLeftWidth: "4px",
              borderLeftColor: "#8BA3C0",
            }}
          >
            <div
              className="w-14 h-14 rounded-xl border flex items-center justify-center mb-8 shrink-0 shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: "#8BA3C01A", borderColor: "#8BA3C030" }}
            >
              <Database weight="fill" className="w-6 h-6" style={{ color: "#8BA3C0" }} />
            </div>
            <h3 className="font-exo2 text-2xl font-bold text-white mb-4">{t("col1Title")}</h3>
            <p className="font-onest text-[15px] text-[#666] leading-relaxed">{t("col1Desc")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative flex flex-col p-8 lg:p-10 bg-[#070707] border border-white/[0.05] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden transition-all hover:bg-[#090909] hover:border-white/10"
            style={{
              borderTopLeftRadius: "32px",
              borderBottomRightRadius: "32px",
              borderTopRightRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderLeftWidth: "4px",
              borderLeftColor: "#E64C4C",
            }}
          >
            <div
              className="w-14 h-14 rounded-xl border flex items-center justify-center mb-8 shrink-0 shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: "#E64C4C1A", borderColor: "#E64C4C30" }}
            >
              <ShieldWarning weight="fill" className="w-6 h-6" style={{ color: "#E64C4C" }} />
            </div>
            <h3 className="font-exo2 text-2xl font-bold text-white mb-4">{t("col2Title")}</h3>
            <p className="font-onest text-[15px] text-[#666] leading-relaxed">{t("col2Desc")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative flex flex-col p-8 lg:p-10 bg-gradient-to-br from-[#080808] to-[#040404] border border-white/[0.08] overflow-hidden md:col-span-2 lg:col-span-1 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] transition-all duration-500 hover:border-white/20"
            style={{
              borderTopLeftRadius: "32px",
              borderBottomRightRadius: "32px",
              borderTopRightRadius: "4px",
              borderBottomLeftRadius: "4px",
              borderLeftWidth: "4px",
              borderLeftColor: "#43C79D",
            }}
          >
            <div
              className="w-14 h-14 rounded-xl border flex items-center justify-center mb-8 shrink-0 z-10 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.8)]"
              style={{ backgroundColor: "#43C79D", borderColor: "#43C79D" }}
            >
              <Sparkle weight="fill" className="w-7 h-7 text-black" />
            </div>
            <h3 className="font-exo2 text-2xl font-bold text-white mb-4 z-10">{t("col3Title")}</h3>
            <p className="font-onest text-[15px] text-[#999] leading-relaxed z-10">{t("col3Desc")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
