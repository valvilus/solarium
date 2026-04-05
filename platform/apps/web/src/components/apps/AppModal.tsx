"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { AppMeta } from "@/lib/app-registry";
import { useTranslations, useLocale } from "next-intl";

type AppModalProps = {
  readonly app: AppMeta;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly category: string;
  readonly onClose: () => void;
};

export function AppModal({ app, name, tagline, description, category, onClose }: AppModalProps): JSX.Element {
  const t = useTranslations("Apps");
  const locale = useLocale();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      style={{ "--app-accent": app.accentColor, "--app-accent-rgb": app.accentRgb } as React.CSSProperties}
    >
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl border overflow-hidden"
        style={{
          background: app.bgGradient,
          borderColor: `rgba(${app.accentRgb}, 0.25)`,
          boxShadow: `0 0 60px rgba(${app.accentRgb}, 0.15)`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-200 z-10"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="p-7 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center shrink-0"
              style={{ backgroundColor: `rgba(${app.accentRgb}, 0.1)` }}
            >
              <span className="text-xl font-black font-mono" style={{ color: app.accentColor }}>
                {name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{category}</span>
              <h2 className="text-white font-bold text-xl tracking-tight">{name}</h2>
            </div>
          </div>

          <p className="text-sm font-semibold" style={{ color: app.accentColor }}>
            {tagline}
          </p>

          <p className="text-neutral-300 text-sm leading-relaxed">{description}</p>

          <div
            className="px-3 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest"
            style={{
              borderColor: `rgba(${app.accentRgb}, 0.2)`,
              backgroundColor: `rgba(${app.accentRgb}, 0.04)`,
              color: `rgba(${app.accentRgb}, 0.7)`,
            }}
          >
            {t("modalProtocol")}
          </div>

          <div className="flex gap-3 pt-1">
            {app.status !== "coming_soon" ? (
              <Link
                href={`/${locale}/apps/${app.slug}`}
                className="flex-1 h-10 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center text-black transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: app.accentColor }}
              >
                {t("openApp")}
              </Link>
            ) : (
              <div className="flex-1 h-10 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center text-neutral-600 bg-[#1E2330] cursor-not-allowed">
                {t("statusComingSoon")}
              </div>
            )}
            <button
              onClick={onClose}
              className="h-10 px-5 rounded-xl font-bold text-[11px] uppercase tracking-widest text-neutral-400 border border-[#1E2330] hover:border-[#2A2D3A] hover:text-white transition-all duration-200"
            >
              {t("learnMore")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
