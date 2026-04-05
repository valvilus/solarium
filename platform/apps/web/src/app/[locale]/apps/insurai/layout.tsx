"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { InsurAiLocaleSwitcher } from "@/components/insurai/InsurAiLocaleSwitcher";

const WalletSection = dynamic(() => import("@/components/insurai/InsurAiWalletSection"), {
  ssr: false,
  loading: () => <div className="h-10 w-40 bg-slate-100 rounded-xl animate-pulse" />,
});

const NAV_ITEMS = [
  {
    href: "",
    label: "Сводка",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/marketplace",
    label: "Маркетплейс",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    href: "/claims/new",
    label: "Новый Иск",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    href: "/claims",
    label: "Все Заявки",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
];

function InsurAiHeader() {
  const locale = useLocale();
  const pathname = usePathname();
  const baseUrl = `/${locale}/apps/insurai`;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-40 px-6 h-20 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-10">
        <Link href={`/${locale}/apps`} className="flex items-center gap-3 group">
          <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl group-hover:bg-emerald-100 transition-colors">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#1E293B]">
            Insur<span className="text-[#059669]">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-1">
          {NAV_ITEMS.map((item) => {
            const path = `${baseUrl}${item.href}`;
            const isActive = pathname === path || (item.href !== "" && pathname.startsWith(path));
            return (
              <Link
                key={item.href}
                href={path}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border ${
                  isActive
                    ? "bg-[#F1F5F9] text-[#0F172A] shadow-sm border-[#E2E8F0]"
                    : "text-slate-500 hover:text-[#0F172A] hover:bg-slate-50 border-transparent"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center bg-slate-50 px-3 py-2 rounded-xl border border-[#E2E8F0] shadow-sm cursor-pointer hover:bg-slate-100 transition-colors">
          <InsurAiLocaleSwitcher />
        </div>
        <WalletSection />
      </div>
    </header>
  );
}

export default function InsurAiLayout({ children }: { readonly children: React.ReactNode }): JSX.Element {
  return (
    <div
      className="flex flex-col min-h-screen w-full text-[#0F172A] overflow-x-hidden"
      style={{ backgroundColor: "#F8FAFC", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <InsurAiHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
