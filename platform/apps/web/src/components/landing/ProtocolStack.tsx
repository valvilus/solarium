"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { TerminalWindow, Cpu, ShieldCheck, CaretLeft, CaretRight, ArrowUpRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";

const ACCENT_SDK = "#8BA3C0";
const ACCENT_WORKER = "#F1B959";
const ACCENT_VALIDATOR = "#43C79D";

const BG_SDK = "#06070A";
const BG_WORKER = "#0A0805";
const BG_VALIDATOR = "#050A08";

const BORDER_SDK = "rgba(139,163,192,0.15)";
const BORDER_WORKER = "rgba(241,185,89,0.15)";
const BORDER_VALIDATOR = "rgba(67,199,157,0.15)";

const CARD_WIDTH = 740;
const CARD_HEIGHT = 690;
const TRACK_HEIGHT = CARD_HEIGHT + 20;
const SIDE_OFFSET = 400;

type Slot = "center" | "left" | "right";

type ResolvedCard = {
  readonly accent: string;
  readonly bg: string;
  readonly borderColor: string;
  readonly icon: React.ElementType;
  readonly label: string;
  readonly title: string;
  readonly desc: string;
  readonly d1Label: string;
  readonly d1Value: string;
  readonly d2Label: string;
  readonly d2Value: string;
  readonly btnLabel: string;
  readonly btnHref: string;
  readonly codeLines: readonly string[];
  readonly codeName: string;
};

const SLOT_TRANSFORM: Record<Slot, string> = {
  center: "rotateY(0deg) scale(1) translateZ(0px)",
  right: `translateX(${SIDE_OFFSET}px) rotateY(-26deg) scale(0.76) translateZ(-70px)`,
  left: `translateX(-${SIDE_OFFSET}px) rotateY(26deg) scale(0.76) translateZ(-70px)`,
};

const SLOT_OPACITY: Record<Slot, number> = { center: 1, right: 0.32, left: 0.32 };
const SLOT_Z: Record<Slot, number> = { center: 20, right: 10, left: 10 };

function getSlot(idx: number, active: number): Slot {
  const rel = (idx - active + 3) % 3;
  if (rel === 0) return "center";
  if (rel === 1) return "right";
  return "left";
}

type TypewriterProps = {
  readonly lines: readonly string[];
  readonly name: string;
  readonly isActive: boolean;
};

function TypewriterTerminal({ lines, name, isActive }: TypewriterProps): JSX.Element {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setVisible(0);
      return;
    }
    if (visible >= lines.length) return;
    const delay = visible === 0 ? 420 : 210;
    const timer = setTimeout(() => setVisible((v) => v + 1), delay);
    return () => clearTimeout(timer);
  }, [isActive, visible, lines.length]);

  return (
    <div className="rounded-xl bg-black/50 border border-white/[0.05] overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] flex-shrink-0">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/10" />
          ))}
        </div>
        <span className="font-mono text-[9px] text-[#383838] uppercase tracking-widest">{name}</span>
      </div>
      <div className="flex-1 overflow-hidden p-5 font-mono text-[11.5px] leading-[1.9]">
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              opacity: i < visible ? 1 : 0,
              transform: i < visible ? "translateX(0)" : "translateX(-8px)",
              transition: "opacity 0.22s ease, transform 0.22s ease",
            }}
            dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
          />
        ))}
        {visible > 0 && visible <= lines.length && (
          <span className="inline-block w-[7px] h-[13px] bg-white/30 animate-pulse ml-0.5 translate-y-[2px]" />
        )}
      </div>
    </div>
  );
}

type StatPillProps = {
  readonly label: string;
  readonly value: string;
  readonly accent: string;
};

function StatPill({ label, value, accent }: StatPillProps): JSX.Element {
  return (
    <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <p className="font-mono text-[9px] uppercase tracking-widest text-[#444] mb-1.5">{label}</p>
      <p className="font-exo2 font-bold text-[20px]" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

type CarouselCardProps = {
  readonly card: ResolvedCard;
  readonly slot: Slot;
  readonly onActivate: () => void;
};

function CarouselCard({ card, slot, onActivate }: CarouselCardProps): JSX.Element {
  const Icon = card.icon;
  const isCenter = slot === "center";

  return (
    <div
      onClick={!isCenter ? onActivate : undefined}
      style={{
        position: "absolute",
        top: 0,
        left: "50%",
        marginLeft: `-${CARD_WIDTH / 2}px`,
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        transform: SLOT_TRANSFORM[slot],
        opacity: SLOT_OPACITY[slot],
        zIndex: SLOT_Z[slot],
        cursor: isCenter ? "default" : "pointer",
        pointerEvents: isCenter ? "none" : "auto",
        transition: "transform 0.72s cubic-bezier(0.16,1,0.3,1), opacity 0.72s ease, box-shadow 0.72s ease",
        background: card.bg,
        borderRadius: "1.75rem",
        border: `1px solid ${card.borderColor}`,
        boxShadow: isCenter ? `0 40px 100px -20px rgba(0,0,0,0.9), 0 20px 40px -20px rgba(0,0,0,0.6)` : "none",
        overflow: "hidden",
      }}
    >
      <div className="p-9 h-full flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0"
            style={{ backgroundColor: `${card.accent}14`, borderColor: `${card.accent}2A` }}
          >
            <Icon weight="fill" className="w-5 h-5" style={{ color: card.accent }} />
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: card.accent }}>
            {card.label}
          </span>
        </div>

        <div>
          <h3 className="font-exo2 text-[1.75rem] font-bold text-white leading-tight tracking-tight mb-3">
            {card.title}
          </h3>
          <p className="font-onest text-[14.5px] text-[#777] leading-[1.8] line-clamp-3">{card.desc}</p>
        </div>

        <div className="flex gap-3">
          <StatPill label={card.d1Label} value={card.d1Value} accent={card.accent} />
          <StatPill label={card.d2Label} value={card.d2Value} accent={card.accent} />
        </div>

        <div className="flex-1 min-h-0">
          <TypewriterTerminal lines={card.codeLines} name={card.codeName} isActive={isCenter} />
        </div>

        <Link
          href={card.btnHref}
          className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-full font-outfit font-medium text-[12.5px] uppercase tracking-wider transition-all duration-300 hover:scale-[1.03]"
          style={{
            color: card.accent,
            border: `1px solid ${card.borderColor}`,
            backgroundColor: `${card.accent}10`,
          }}
        >
          {card.btnLabel}
          <ArrowUpRight weight="bold" className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

type NavButtonProps = {
  readonly direction: "left" | "right";
  readonly onClick: () => void;
};

function NavButton({ direction, onClick }: NavButtonProps): JSX.Element {
  const Icon = direction === "left" ? CaretLeft : CaretRight;
  return (
    <button
      onClick={onClick}
      className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-300"
    >
      <Icon weight="bold" className="w-4 h-4" />
    </button>
  );
}

export function ProtocolStack(): JSX.Element {
  const t = useTranslations("ProtocolStack");
  const [active, setActive] = useState(0);

  const cards: readonly ResolvedCard[] = [
    {
      accent: ACCENT_SDK,
      bg: BG_SDK,
      borderColor: BORDER_SDK,
      icon: TerminalWindow,
      label: t("sdkLabel"),
      title: t("sdkTitle"),
      desc: t("sdkDesc"),
      d1Label: t("sdkD1Label"),
      d1Value: t("sdkD1Value"),
      d2Label: t("sdkD2Label"),
      d2Value: t("sdkD2Value"),
      btnLabel: t("sdkBtn"),
      btnHref: "/docs",
      codeLines: [
        `<span style="color:${ACCENT_SDK}">import</span> <span style="color:#8ECAE6">{ SolariumClient }</span> <span style="color:${ACCENT_SDK}">from</span> <span style="color:${ACCENT_VALIDATOR}">'@solarium-labs/sdk'</span>`,
        ``,
        `<span style="color:${ACCENT_SDK}">const</span> client = <span style="color:${ACCENT_SDK}">new</span> <span style="color:#8ECAE6">SolariumClient</span>(provider)`,
        ``,
        `<span style="color:${ACCENT_SDK}">const</span> { taskId } = <span style="color:${ACCENT_SDK}">await</span> client`,
        `  .<span style="color:#8ECAE6">createTask</span>({ inputHash, reward })`,
        ``,
        `<span style="color:${ACCENT_SDK}">const</span> result = <span style="color:${ACCENT_SDK}">await</span> client.<span style="color:#8ECAE6">fetchTask</span>(taskId)`,
      ],
      codeName: "sdk.ts",
    },
    {
      accent: ACCENT_WORKER,
      bg: BG_WORKER,
      borderColor: BORDER_WORKER,
      icon: Cpu,
      label: t("workerLabel"),
      title: t("workerTitle"),
      desc: t("workerDesc"),
      d1Label: t("workerD1Label"),
      d1Value: t("workerD1Value"),
      d2Label: t("workerD2Label"),
      d2Value: t("workerD2Value"),
      btnLabel: t("workerBtn"),
      btnHref: "/docs/node-guide",
      codeLines: [
        `<span style="color:${ACCENT_WORKER}">NODE_ROLE</span>=<span style="color:${ACCENT_VALIDATOR}">worker</span>`,
        `<span style="color:${ACCENT_WORKER}">AI_MODEL</span>=<span style="color:${ACCENT_VALIDATOR}">any-supported-model</span>`,
        ``,
        `<span style="color:#3A3A3A">$ node agent/src/index.js</span>`,
        ``,
        `<span style="color:#444">[INFO] Scanning open tasks...</span>`,
        `<span style="color:#666">[INFO] Claimed task <span style="color:${ACCENT_WORKER}">#4821</span></span>`,
        `<span style="color:#888">[INFO] Commitment posted on-chain</span>`,
        `<span style="color:#aaa">[INFO] Reward <span style="color:${ACCENT_WORKER}">+0.8 SOL</span></span>`,
      ],
      codeName: ".env / agent stdout",
    },
    {
      accent: ACCENT_VALIDATOR,
      bg: BG_VALIDATOR,
      borderColor: BORDER_VALIDATOR,
      icon: ShieldCheck,
      label: t("validatorLabel"),
      title: t("validatorTitle"),
      desc: t("validatorDesc"),
      d1Label: t("validatorD1Label"),
      d1Value: t("validatorD1Value"),
      d2Label: t("validatorD2Label"),
      d2Value: t("validatorD2Value"),
      btnLabel: t("validatorBtn"),
      btnHref: "/docs/node-guide",
      codeLines: [
        `<span style="color:${ACCENT_VALIDATOR}">NODE_ROLE</span>=<span style="color:${ACCENT_SDK}">validator</span>`,
        ``,
        `<span style="color:#3A3A3A">$ node agent/src/index.js</span>`,
        ``,
        `<span style="color:#444">[INFO] Watching committed tasks...</span>`,
        `<span style="color:#666">[INFO] Fetched Worker report <span style="color:${ACCENT_VALIDATOR}">#4821</span></span>`,
        `<span style="color:#888">[INFO] LLM-as-a-Judge verdict: <span style="color:${ACCENT_VALIDATOR}">AGREE</span></span>`,
        `<span style="color:#aaa">[INFO] Reward <span style="color:${ACCENT_VALIDATOR}">+0.2 SOL</span></span>`,
      ],
      codeName: ".env / agent stdout",
    },
  ];

  const goNext = (): void => setActive((p) => (p + 1) % 3);
  const goPrev = (): void => setActive((p) => (p + 2) % 3);

  return (
    <section
      id="protocol-stack"
      className="relative w-full pt-24 lg:pt-36 bg-[#050505] border-t border-white/5 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">{t("badge")}</span>
          </div>
          <h2 className="font-exo2 text-4xl lg:text-[3.5rem] font-bold text-white uppercase tracking-wide leading-[1.1] mb-5">
            {t("title1")}
            <br className="hidden md:block" />
            <span className="text-white/30">{t("title2")}</span>
          </h2>
          <p className="font-onest text-[#555] text-lg leading-relaxed max-w-[560px]">{t("subtitle")}</p>
        </motion.div>
      </div>

      <div
        className="relative w-full z-10"
        style={{ height: `${TRACK_HEIGHT}px`, perspective: "1100px", perspectiveOrigin: "50% 42%" }}
      >
        {cards.map((card, idx) => (
          <CarouselCard key={idx} card={card} slot={getSlot(idx, active)} onActivate={() => setActive(idx)} />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center gap-6 mt-14 pb-36">
        <NavButton direction="left" onClick={goPrev} />
        <div className="flex items-center gap-3">
          {cards.map((card, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              style={{
                width: active === idx ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: active === idx ? card.accent : "rgba(255,255,255,0.12)",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          ))}
        </div>
        <NavButton direction="right" onClick={goNext} />
      </div>
    </section>
  );
}
