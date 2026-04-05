"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export const LocaleSwitcher = (): JSX.Element => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = locale === "en" ? "ru" : "en";
  const label = locale === "en" ? "RU" : "EN";

  const handleSwitch = (): void => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${switchTo}${pathWithoutLocale}`);
  };

  return (
    <button
      onClick={handleSwitch}
      className="w-full h-9 bg-[#13151E] border border-[#2A2D3A] hover:border-[rgba(var(--accent-rgb),0.4)] rounded-lg flex items-center justify-center gap-2 transition-all duration-500 group"
    >
      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest group-hover:text-neutral-300 transition-colors">
        {locale.toUpperCase()}
      </span>
      <span className="text-[9px] text-neutral-600">/</span>
      <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest transition-colors duration-1000">
        {label}
      </span>
    </button>
  );
};
