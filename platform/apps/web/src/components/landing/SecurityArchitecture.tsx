"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Scales, LockKey, TrendUp } from "@phosphor-icons/react";

const COLOR_JUDGE = "#8BA3C0";
const COLOR_LOCK = "#FF6B6B";
const COLOR_GAME = "#F1B959";

type RevealProps = {
  readonly delay?: number;
  readonly className: string;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
};

function Reveal({ delay = 0, className, style, children }: RevealProps): JSX.Element {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type StatBlockProps = {
  readonly value: string;
  readonly label: string;
  readonly color: string;
};

function StatBlock({ value, label, color }: StatBlockProps): JSX.Element {
  return (
    <div>
      <p className="font-exo2 font-bold text-5xl leading-none" style={{ color }}>
        {value}
      </p>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#3A3A3A] mt-2">{label}</p>
    </div>
  );
}

type MechanismHeaderProps = {
  readonly label: string;
  readonly name: string;
  readonly color: string;
  readonly icon: React.ElementType;
};

function MechanismHeader({ label, name, color, icon: Icon }: MechanismHeaderProps): JSX.Element {
  return (
    <div className="flex items-center gap-3 mb-7">
      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#2A2A2A]">{label}</span>
      <div className="h-px flex-1 bg-white/[0.03]" />
      <Icon weight="fill" className="w-4 h-4 flex-shrink-0" style={{ color: `${color}80` }} />
    </div>
  );
}

type EscalationBarProps = {
  readonly height: number;
  readonly label: string;
  readonly cost: string;
  readonly delay: number;
  readonly opacity: number;
};

function EscalationBar({ height, label, cost, delay, opacity }: EscalationBarProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <span className="font-exo2 font-bold text-[13px]" style={{ color: COLOR_GAME, opacity }}>
        {cost}
      </span>
      <motion.div
        className="w-11"
        style={{
          backgroundColor: COLOR_GAME,
          opacity,
          height: `${height}px`,
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
        }}
        initial={{ scaleY: 0, transformOrigin: "bottom" }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      <span className="font-mono text-[8px] uppercase tracking-widest text-[#3A3A3A]">{label}</span>
    </div>
  );
}

export function SecurityArchitecture(): JSX.Element {
  const t = useTranslations("SecurityArchitecture");

  return (
    <section id="security" className="relative w-full py-32 bg-[#050505] overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLOR_LOCK }} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">{t("badge")}</span>
          </div>
          <h2 className="font-exo2 text-4xl lg:text-[3.5rem] font-bold text-white uppercase tracking-wide leading-[1.1] mb-5">
            {t("title1")}
            <br />
            <span className="text-white/25">{t("title2")}</span>
          </h2>
          <p className="font-onest text-[#555] text-lg leading-relaxed max-w-[580px]">{t("subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Reveal
            delay={0}
            className="md:col-span-2 relative rounded-3xl border border-white/[0.05] bg-[#050608] overflow-hidden group hover:border-[#8BA3C0]/20 transition-colors duration-500 shadow-2xl"
          >
            <div
              className="absolute top-0 right-0 w-[340px] h-[340px] rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${COLOR_JUDGE}08 0%, transparent 70%)` }}
            />
            <div className="p-10 lg:p-12 relative z-10 h-full flex flex-col">
              <MechanismHeader label={t("m1Label")} name={t("m1Name")} color={COLOR_JUDGE} icon={Scales} />
              <h3
                className="font-exo2 text-[1.75rem] font-bold uppercase tracking-wide mb-2"
                style={{ color: COLOR_JUDGE }}
              >
                {t("m1Name")}
              </h3>
              <p className="font-exo2 text-[1.1rem] font-semibold text-white mb-5">{t("m1Claim")}</p>
              <p className="font-onest text-[14.5px] text-[#666] leading-[1.85] max-w-md mb-10">{t("m1Desc")}</p>
              <div className="mt-auto flex items-end justify-between">
                <StatBlock value={t("m1Stat")} label={t("m1StatLabel")} color={COLOR_JUDGE} />
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <div
                    className="px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: `${COLOR_JUDGE}25`, backgroundColor: `${COLOR_JUDGE}0C`, color: COLOR_JUDGE }}
                  >
                    WORKER OUTPUT
                  </div>
                  <span className="text-[#222]">→</span>
                  <div className="px-3 py-1.5 rounded-lg border border-white/[0.04] bg-white/[0.02] text-[#444]">
                    T=0
                  </div>
                  <span className="text-[#222]">→</span>
                  <div
                    className="px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: `${COLOR_JUDGE}25`, backgroundColor: `${COLOR_JUDGE}0C`, color: COLOR_JUDGE }}
                  >
                    VERDICT
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal
            delay={0.1}
            className="md:col-span-1 relative rounded-3xl border overflow-hidden group transition-colors duration-500 shadow-2xl"
            style={{ borderColor: `${COLOR_LOCK}14`, backgroundColor: "#0A0505" }}
          >
            <div
              className="absolute -bottom-12 -right-12 w-52 h-52 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${COLOR_LOCK}0F 0%, transparent 70%)` }}
            />
            <div className="p-10 lg:p-12 h-full flex flex-col relative z-10">
              <MechanismHeader label={t("m2Label")} name={t("m2Name")} color={COLOR_LOCK} icon={LockKey} />
              <h3
                className="font-exo2 text-[1.5rem] font-bold uppercase tracking-wide mb-2"
                style={{ color: COLOR_LOCK }}
              >
                {t("m2Name")}
              </h3>
              <p className="font-exo2 text-[1rem] font-semibold text-white mb-5">{t("m2Claim")}</p>
              <p className="font-onest text-[13.5px] text-[#666] leading-[1.85]">{t("m2Desc")}</p>
              <div className="mt-auto pt-10">
                <StatBlock value={t("m2Stat")} label={t("m2StatLabel")} color={COLOR_LOCK} />
              </div>
            </div>
          </Reveal>

          <Reveal
            delay={0.2}
            className="md:col-span-3 relative rounded-3xl border overflow-hidden group transition-colors duration-500 shadow-2xl"
            style={{ borderColor: `${COLOR_GAME}10`, backgroundColor: "#0A0805" }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full pointer-events-none"
              style={{ background: `radial-gradient(ellipse, ${COLOR_GAME}05 0%, transparent 70%)` }}
            />
            <div className="p-10 lg:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 relative z-10">
              <div className="max-w-xl">
                <MechanismHeader label={t("m3Label")} name={t("m3Name")} color={COLOR_GAME} icon={TrendUp} />
                <h3
                  className="font-exo2 text-[1.75rem] font-bold uppercase tracking-wide mb-2"
                  style={{ color: COLOR_GAME }}
                >
                  {t("m3Name")}
                </h3>
                <p className="font-exo2 text-[1.1rem] font-semibold text-white mb-5">{t("m3Claim")}</p>
                <p className="font-onest text-[14.5px] text-[#666] leading-[1.85]">{t("m3Desc")}</p>
              </div>
              <div className="flex items-end gap-5 flex-shrink-0 pb-2">
                <EscalationBar height={44} label="Tier 1" cost="1x" delay={0.42} opacity={0.4} />
                <EscalationBar height={84} label="Tier 2" cost="2x" delay={0.52} opacity={0.6} />
                <EscalationBar height={136} label="Tier 3" cost="4x" delay={0.62} opacity={0.8} />
                <EscalationBar height={200} label="Appeal" cost="8x" delay={0.72} opacity={1.0} />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
