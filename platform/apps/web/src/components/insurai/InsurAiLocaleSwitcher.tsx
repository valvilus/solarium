"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export function InsurAiLocaleSwitcher(): JSX.Element {
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
    <button onClick={handleSwitch} className="flex items-center gap-2 text-sm font-bold">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-400"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span className="text-slate-500">{locale.toUpperCase()}</span>
      <span className="text-slate-300">/</span>
      <span className="text-[#059669] font-extrabold">{label}</span>
    </button>
  );
}
