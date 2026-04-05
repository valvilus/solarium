"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  TerminalWindow,
  ChartLineUp,
  ShieldWarning,
  Graph,
  BookOpen,
  Gauge,
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  SquaresFour,
} from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";
import { LocaleSwitcher } from "../ui/LocaleSwitcher";

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

type NavLinkProps = {
  readonly href: string;
  readonly icon: JSX.Element;
  readonly label: string;
  readonly exact?: boolean;
};

const NavLink = ({ href, icon, label, exact }: NavLinkProps): JSX.Element => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all duration-300 flex-shrink-0 ${
        isActive
          ? "text-black bg-[var(--accent)] shadow-[0_0_12px_rgba(var(--accent-rgb),0.25)]"
          : "text-neutral-400 hover:text-white hover:bg-[rgba(var(--accent-rgb),0.1)]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const WalletStatus = (): JSX.Element => {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const t = useTranslations("Sidebar");

  if (connected && publicKey) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-[rgba(var(--accent-rgb),0.06)] border border-[rgba(var(--accent-rgb),0.2)] rounded-xl">
          <CheckCircle weight="fill" size={14} className="text-green-400 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">
              {t("walletConnected")}
            </span>
            <span className="text-[11px] font-mono text-[var(--accent)] truncate">
              {truncateAddress(publicKey.toBase58())}
            </span>
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="w-full h-8 bg-transparent border border-[#1E2330] hover:border-red-500/40 hover:bg-red-500/5 text-neutral-600 hover:text-red-400 rounded-lg font-semibold text-[9px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
        >
          <XCircle weight="bold" size={12} />
          {t("disconnect")}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="w-full h-10 bg-transparent border border-[rgba(var(--accent-rgb),0.4)] hover:border-[var(--accent)] hover:bg-[rgba(var(--accent-rgb),0.08)] text-[var(--accent)] rounded-xl font-semibold text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
    >
      <div className="w-2 h-2 rounded-full border border-[var(--accent)]" />
      {t("connectWallet")}
    </button>
  );
};

export const AppSidebar = (): JSX.Element => {
  const t = useTranslations("Sidebar");
  const locale = useLocale();

  return (
    <aside className="w-[240px] border-r border-[#1E2330] bg-[#0A0B10]/90 backdrop-blur-3xl flex-col justify-between hidden lg:flex z-50 fixed top-0 bottom-0 left-0">
      <div className="h-20 flex items-center px-6 border-b border-[#1E2330] shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] animate-pulse mr-3 shrink-0" />
        <span className="font-bold text-lg tracking-[0.15em] text-white uppercase shrink-0">{t("solarium")}</span>
      </div>

      <div className="p-5 space-y-6 flex-1 overflow-y-auto no-scrollbar">
        <div>
          <p className="text-[9px] font-bold text-[rgba(var(--accent-rgb),0.6)] uppercase mb-3 px-2 tracking-widest">
            {t("network")}
          </p>
          <nav className="space-y-1 flex flex-col">
            <NavLink href={`/${locale}`} icon={<TerminalWindow weight="bold" size={16} />} label={t("console")} exact />
            <NavLink href={`/${locale}/dashboard`} icon={<Gauge weight="bold" size={16} />} label={t("dashboard")} />
            <NavLink
              href={`/${locale}/explorer`}
              icon={<MagnifyingGlass weight="bold" size={16} />}
              label={t("explorer")}
            />
            <NavLink href={`/${locale}/apps`} icon={<SquaresFour weight="bold" size={16} />} label={t("apps")} />
            <NavLink href={`/${locale}/docs`} icon={<BookOpen weight="bold" size={16} />} label={t("docs")} />
          </nav>
        </div>

        <div>
          <p className="text-[9px] font-bold text-[rgba(var(--accent-rgb),0.6)] uppercase mb-3 px-2 tracking-widest">
            {t("operator")}
          </p>
          <nav className="space-y-1 flex flex-col">
            <NavLink
              href={`/${locale}/dashboard`}
              icon={<ShieldWarning weight="bold" size={16} />}
              label={t("nodes")}
            />
            <NavLink href={`/${locale}/dashboard`} icon={<Graph weight="bold" size={16} />} label={t("staking")} />
            <NavLink href={`/${locale}/explorer`} icon={<ChartLineUp weight="bold" size={16} />} label={t("metrics")} />
          </nav>
        </div>
      </div>

      <div className="p-5 border-t border-[#1E2330] shrink-0 w-full space-y-3">
        <LocaleSwitcher />
        <WalletStatus />
      </div>
    </aside>
  );
};
