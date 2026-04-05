"use client";

import type { AppCategory } from "@/lib/app-registry";
import { useTranslations } from "next-intl";

const FILTERS: Array<{ key: AppCategory | "all"; labelKey: string }> = [
  { key: "all", labelKey: "filterAll" },
  { key: "finance", labelKey: "filterFinance" },
  { key: "insurance", labelKey: "filterInsurance" },
  { key: "security", labelKey: "filterSecurity" },
];

type AppsFilterBarProps = {
  readonly active: AppCategory | "all";
  readonly onChange: (category: AppCategory | "all") => void;
};

export function AppsFilterBar({ active, onChange }: AppsFilterBarProps): JSX.Element {
  const t = useTranslations("Apps");

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FILTERS.map(({ key, labelKey }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`h-8 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border ${
            active === key
              ? "text-black bg-[var(--accent)] border-transparent shadow-[0_0_12px_rgba(var(--accent-rgb),0.3)]"
              : "text-neutral-400 border-[#1E2330] hover:text-white hover:border-[#2A2D3A] bg-transparent"
          }`}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
}
