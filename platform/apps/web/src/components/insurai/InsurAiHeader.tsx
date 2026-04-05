"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";

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
    label: "Запрос Выплаты",
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
];

function WalletSection(): JSX.Element {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-4 pl-5 border-l border-[#E2E8F0]">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-[#0F172A] leading-tight">Агро-Юг</p>
          <p className="text-xs text-slate-500 font-mono font-medium">
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 p-0.5 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
          <div className="w-full h-full bg-white rounded-full" />
        </div>
        <button
          onClick={() => disconnect()}
          className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
        >
          Выйти
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-md"
    >
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
        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
        <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
        <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
      </svg>
      Подключить Кошелек
    </button>
  );
}

export function InsurAiHeader(): JSX.Element {
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
        <div className="hidden sm:block text-sm font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-[#E2E8F0] shadow-sm">
          <LocaleSwitcher />
        </div>

        <WalletSection />
      </div>
    </header>
  );
}
