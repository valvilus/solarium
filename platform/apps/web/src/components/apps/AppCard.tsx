"use client";

import type { AppMeta } from "@/lib/app-registry";
import { useTranslations } from "next-intl";

type StatusBadgeProps = {
  readonly status: AppMeta["status"];
};

function StatusBadge({ status }: StatusBadgeProps): JSX.Element {
  const t = useTranslations("Apps");

  const labelMap: Record<AppMeta["status"], string> = {
    live: t("statusLive"),
    beta: t("statusBeta"),
    coming_soon: t("statusComingSoon"),
  };

  const styleMap: Record<AppMeta["status"], string> = {
    live: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    beta: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    coming_soon: "bg-neutral-500/10 text-neutral-400 border-neutral-500/30",
  };

  return (
    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${styleMap[status]}`}>
      {labelMap[status]}
    </span>
  );
}

type AppCardProps = {
  readonly app: AppMeta;
  readonly name: string;
  readonly tagline: string;
  readonly category: string;
  readonly onClick: () => void;
};

export function AppCard({ app, name, tagline, category, onClick }: AppCardProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left rounded-2xl border border-[#1E2330] overflow-hidden transition-all duration-300 hover:border-[var(--app-accent)] hover:shadow-[0_0_24px_rgba(var(--app-accent-rgb),0.12)] bg-[#0A0B10]"
      style={
        {
          "--app-accent": app.accentColor,
          "--app-accent-rgb": app.accentRgb,
        } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: app.bgGradient }}
      />

      <div className="relative z-10 p-5 flex flex-col gap-4">
        <div
          className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center"
          style={{ backgroundColor: `rgba(${app.accentRgb}, 0.08)` }}
        >
          <span className="text-lg font-black font-mono" style={{ color: app.accentColor }}>
            {name.slice(0, 2).toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">{category}</span>
            <StatusBadge status={app.status} />
          </div>
          <h3 className="text-white font-bold text-base tracking-tight">{name}</h3>
          <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2">{tagline}</p>
        </div>

        <div className="h-px w-full opacity-20" style={{ backgroundColor: app.accentColor }} />

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: app.accentColor }}>
            Solarium Protocol
          </span>
          <div
            className="w-6 h-6 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ borderColor: `rgba(${app.accentRgb}, 0.4)` }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 8L8 2M8 2H3M8 2V7"
                stroke={app.accentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}
