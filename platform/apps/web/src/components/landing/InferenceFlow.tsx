"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TreeStructure, Cpu, Scales, LockKey, Link, Gavel, CheckCircle, GitBranch } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

export function InferenceFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("InferenceFlow");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const steps = [
    {
      id: "01",
      icon: TreeStructure,
      title: t("step1Title"),
      desc: t("step1Desc"),
      color: "#43C79D",
    },
    {
      id: "02",
      icon: Cpu,
      title: t("step2Title"),
      desc: t("step2Desc"),
      color: "#8BA3C0",
    },
    {
      id: "03",
      icon: Scales,
      title: t("step3Title"),
      desc: t("step3Desc"),
      color: "#F1B959",
    },
  ];

  const COLOR_TEAL = "#43C79D";
  const COLOR_CRIMSON = "#E64C4C";

  return (
    <section
      id="process"
      className="relative w-full py-24 lg:py-40 bg-[#050505] overflow-hidden font-sans border-t border-white/5"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_10%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center text-center gap-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08]"
          >
            <Link weight="fill" className="w-4 h-4 text-[#A3A3A3]" />
            <span className="font-onest text-[11px] font-semibold uppercase tracking-widest text-[#A3A3A3]">
              {t("badge")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-exo2 text-4xl lg:text-5xl font-bold text-white tracking-wide uppercase"
          >
            {t("title1")} <br className="md:hidden" />
            <span className="text-white/40">{t("title2")}</span>
          </motion.h2>
        </div>

        <div ref={containerRef} className="relative w-full mx-auto md:max-w-4xl flex flex-col gap-12 lg:gap-0 mt-8">
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-[300px] w-px bg-white/5 md:-translate-x-1/2" />

          <motion.div
            style={{
              height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
              opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
            }}
            className="absolute left-[28px] md:left-1/2 top-0 w-[3px] bg-gradient-to-b from-transparent via-white to-transparent md:-translate-x-1/2 z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          />

          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`relative flex flex-col md:flex-row items-start md:items-center w-full min-h-[200px] ${
                  isEven ? "md:justify-start" : "md:justify-end"
                }`}
              >
                <div
                  className={`absolute left-0 md:left-1/2 w-14 h-14 bg-[#0A0A0A] border rounded-xl md:-translate-x-1/2 z-20 flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] transition-all group-hover:scale-110 duration-500`}
                  style={{ borderColor: `${step.color}33` }}
                >
                  <step.icon weight="fill" className="w-6 h-6" style={{ color: step.color }} />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative pl-24 md:pl-0 w-full md:w-[45%] ${isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"}`}
                >
                  <div
                    className="flex flex-col p-8 rounded-3xl transition-all duration-500 ease-out bg-[#070707] border border-white/[0.05] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] group-hover:border-white/10"
                    style={{
                      borderLeftColor: isEven ? `${step.color}40` : undefined,
                      borderRightColor: !isEven ? `${step.color}40` : undefined,
                    }}
                  >
                    <div className="text-[10px] font-mono tracking-widest uppercase mb-4" style={{ color: step.color }}>
                      — Шаг {step.id}
                    </div>
                    <h3 className="font-exo2 text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p
                      className={`font-onest text-[15px] leading-relaxed text-[#666] group-hover:text-[#A3A3A3] transition-colors duration-300 ${isEven ? "md:ml-auto" : ""}`}
                    >
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}

          <div className="relative mt-8 lg:mt-16 pt-16 border-t border-white/5 md:border-none md:pt-24 pb-12 w-full">
            <div className="hidden md:block absolute left-0 right-0 top-0 h-32 z-0 pointer-events-none">
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 800 100">
                <motion.path
                  d="M 400 0 Q 400 60 200 80 L 150 82"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  className="opacity-40"
                />

                <motion.path
                  d="M 400 0 Q 400 60 200 80 L 150 82"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="opacity-10 blur-sm"
                />

                <motion.path
                  d="M 400 0 Q 400 60 600 80 L 650 82"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  className="opacity-40"
                />

                <motion.path
                  d="M 400 0 Q 400 60 600 80 L 650 82"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="opacity-10 blur-sm"
                />
              </svg>
            </div>

            <div className="hidden md:flex absolute left-1/2 top-4 w-12 h-12 bg-[#0A0A0A] border border-white/10 rounded-full -translate-x-1/2 z-20 items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              <GitBranch className="w-5 h-5 text-white/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full md:px-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative flex flex-col p-8 rounded-3xl bg-[#070707] border border-white/[0.05] hover:border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] transition-all duration-500 overflow-hidden"
                style={{ borderTopColor: `${COLOR_TEAL}40` }}
              >
                <div className="absolute top-0 right-0 p-4 z-10">
                  <div
                    className="px-3 py-1 border text-[10px] font-bold uppercase tracking-widest rounded-full"
                    style={{ backgroundColor: `${COLOR_TEAL}0C`, color: COLOR_TEAL, borderColor: `${COLOR_TEAL}25` }}
                  >
                    {t("fastPathBadge")}
                  </div>
                </div>
                <div
                  className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 z-10 relative shadow-[0_10px_20px_-5px_rgba(0,0,0,0.8)]"
                  style={{ backgroundColor: `${COLOR_TEAL}0A`, borderColor: `${COLOR_TEAL}25` }}
                >
                  <CheckCircle weight="fill" className="w-7 h-7" style={{ color: COLOR_TEAL }} />
                </div>
                <h3 className="font-exo2 text-2xl font-bold text-white mb-3 z-10 relative">{t("fastPathTitle")}</h3>
                <p className="font-onest text-[15px] text-[#666] leading-relaxed z-10 relative">{t("fastPathDesc")}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="group relative flex flex-col p-8 rounded-3xl bg-[#070707] border border-white/[0.05] hover:border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] transition-all duration-500 overflow-hidden"
                style={{ borderTopColor: `${COLOR_CRIMSON}40` }}
              >
                <div className="absolute top-0 right-0 p-4 z-10">
                  <div
                    className="px-3 py-1 border text-[10px] font-bold uppercase tracking-widest rounded-full"
                    style={{
                      backgroundColor: `${COLOR_CRIMSON}0A`,
                      color: COLOR_CRIMSON,
                      borderColor: `${COLOR_CRIMSON}25`,
                    }}
                  >
                    {t("slowPathBadge")}
                  </div>
                </div>
                <div
                  className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 z-10 relative shadow-[0_10px_20px_-5px_rgba(0,0,0,0.8)]"
                  style={{ backgroundColor: `${COLOR_CRIMSON}0A`, borderColor: `${COLOR_CRIMSON}25` }}
                >
                  <Gavel weight="fill" className="w-7 h-7" style={{ color: COLOR_CRIMSON }} />
                </div>
                <h3 className="font-exo2 text-2xl font-bold text-white mb-3 z-10 relative">{t("slowPathTitle")}</h3>
                <p className="font-onest text-[15px] text-[#666] leading-relaxed z-10 relative">{t("slowPathDesc")}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
