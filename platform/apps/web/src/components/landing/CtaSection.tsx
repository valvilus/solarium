"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ArrowUpRight,
  GitBranch,
  Lightning,
  Anchor,
  Scales,
  GithubLogo,
  Terminal,
  HardDrives,
} from "@phosphor-icons/react";
import Link from "next/link";

const GITHUB_URL = "https://github.com/valvilus/solarium-protocol";
const DOCS_URL = "/docs";
const NODE_URL = "/docs/node-guide";

const COLOR_SDK = "#8BA3C0";
const COLOR_WORKER = "#F1B959";

type StatPillProps = {
  readonly label: string;
  readonly icon: React.ElementType;
};

function StatPill({ label, icon: Icon }: StatPillProps): JSX.Element {
  return (
    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/[0.04] bg-[#070707] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.8)]">
      <Icon weight="fill" className="w-3.5 h-3.5 text-[#666] flex-shrink-0" />
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#888]">{label}</span>
    </div>
  );
}

type CtaCardProps = {
  readonly href: string;
  readonly label: string;
  readonly sublabel: string;
  readonly accent: string;
  readonly external?: boolean;
  readonly delay: number;
  readonly LeftIcon?: React.ElementType<any>;
};

function CtaCard({ href, label, sublabel, accent, external = false, delay, LeftIcon }: CtaCardProps): JSX.Element {
  const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={href}
        {...linkProps}
        className="group relative flex items-center justify-between gap-5 px-6 py-6 rounded-3xl bg-[#070707] border border-white/[0.05] hover:bg-[#0A0A0A] hover:border-white/10 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden w-full lg:w-auto flex-1"
        style={{ minWidth: "260px" }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 120%, ${accent}, transparent 70%)` }}
        />

        <div className="flex items-center gap-5 relative z-10 w-full">
          {LeftIcon && (
            <div
              className="w-12 h-12 flex flex-shrink-0 items-center justify-center rounded-2xl border bg-[#040404] shadow-inner transition-transform duration-500 group-hover:scale-[1.05]"
              style={{ borderColor: `${accent}20`, color: accent }}
            >
              <LeftIcon weight="fill" className="w-6 h-6" />
            </div>
          )}
          <div className="flex flex-col text-left mr-auto overflow-hidden">
            <p
              className="font-mono text-[9px] font-semibold uppercase tracking-[0.25em] mb-1.5 truncate"
              style={{ color: `${accent}99` }}
            >
              {sublabel}
            </p>
            <p className="font-exo2 font-bold text-[16px] lg:text-[17px] text-white tracking-tight leading-none group-hover:-translate-y-[1px] transition-transform duration-300 whitespace-nowrap">
              {label}
            </p>
          </div>
        </div>

        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-[10deg] bg-[#040404] border relative z-10 shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
          style={{ borderColor: `${accent}30` }}
        >
          <ArrowUpRight weight="bold" className="w-[18px] h-[18px]" style={{ color: accent }} />
        </div>
      </Link>
    </motion.div>
  );
}

type FooterLinkProps = {
  readonly href: string;
  readonly label: string;
  readonly external?: boolean;
};

function FooterLink({ href, label, external = false }: FooterLinkProps): JSX.Element {
  const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Link
      href={href}
      {...props}
      className="font-mono text-[11px] uppercase tracking-widest text-[#3A3A3A] hover:text-white/50 transition-colors duration-300"
    >
      {label}
    </Link>
  );
}

export function CtaSection(): JSX.Element {
  const t = useTranslations("CtaSection");

  return (
    <section className="relative w-full bg-[#050505] overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)] pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, rgba(255,255,255,0.04) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-12 pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-3 mb-20"
        >
          <StatPill label={t("stat1")} icon={GitBranch} />
          <StatPill label={t("stat2")} icon={Lightning} />
          <StatPill label={t("stat3")} icon={Anchor} />
          <StatPill label={t("stat4")} icon={Scales} />
        </motion.div>

        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">{t("badge")}</span>
          </motion.div>

          <div className="overflow-hidden mb-3">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-exo2 font-bold text-[clamp(4rem,9vw,9rem)] text-white uppercase tracking-tight leading-[0.9]"
            >
              {t("title1")}
            </motion.h2>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-exo2 font-bold text-[clamp(4rem,9vw,9rem)] text-white/20 uppercase tracking-tight leading-[0.9]"
            >
              {t("title2")}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-onest text-[#4A4A4A] text-[1.1rem] leading-[1.8] max-w-[540px] mb-14"
          >
            {t("subtitle")}
          </motion.p>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full max-w-[900px]">
            <CtaCard
              href={DOCS_URL}
              label={t("btn1")}
              sublabel={t("btn1Sub")}
              accent={COLOR_SDK}
              delay={0.28}
              LeftIcon={Terminal}
            />
            <CtaCard
              href={NODE_URL}
              label={t("btn2")}
              sublabel={t("btn2Sub")}
              accent={COLOR_WORKER}
              delay={0.36}
              LeftIcon={HardDrives}
            />
            <CtaCard
              href={GITHUB_URL}
              label={t("btn3")}
              sublabel={t("btn3Sub")}
              accent="#FFFFFF"
              external
              delay={0.44}
              LeftIcon={GithubLogo}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
