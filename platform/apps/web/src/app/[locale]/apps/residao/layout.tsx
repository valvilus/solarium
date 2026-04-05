"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useTranslations, useLocale } from "next-intl";
import { ResiDaoProvider, useResiDao } from "@/providers/ResiDaoProvider";
import { ResiDaoSidebar } from "@/components/residao/ResiDaoSidebar";
import { TourGuide } from "@/components/residao/TourGuide";

function RoleSwitcher() {
  const { role, setRole } = useResiDao();

  return (
    <div className="flex bg-[#F1F5F9] rounded-xl p-1 border border-[#E2E8F0] shadow-inner">
      <button
        onClick={() => setRole("resident")}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
          role === "resident"
            ? "bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0]"
            : "text-[#64748B] hover:text-[#0F172A] border border-transparent"
        }`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${role === "resident" ? "bg-emerald-500" : "bg-transparent"}`} />
        Режим Жителя
      </button>
      <button
        onClick={() => setRole("contractor")}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
          role === "contractor"
            ? "bg-resi-accent text-white shadow-md border border-resi-accent/20"
            : "text-[#64748B] hover:text-[#0F172A] border border-transparent"
        }`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${role === "contractor" ? "bg-amber-400" : "bg-transparent"}`} />
        B2B Подрядчик
      </button>
    </div>
  );
}

function ResiHeader() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { setTourActive } = useResiDao();

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-[#E2E8F0] px-8 h-20 flex items-center justify-between shrink-0 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold tracking-tight text-[#0F172A] hidden lg:block">Дашборд Управления</h1>
        <div className="h-6 w-px bg-[#E2E8F0] hidden lg:block"></div>
        <RoleSwitcher />
      </div>

      <div className="flex items-center gap-5">
        <button
          onClick={() => setTourActive(true)}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E2E8F0] bg-white text-[#475569] hover:bg-resi-accent/5 hover:border-resi-accent/20 hover:text-resi-accent text-[11px] font-bold uppercase tracking-widest transition-all shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-resi-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-resi-accent"></span>
          </span>
          Питч-Тур для Жюри
        </button>

        {connected && publicKey ? (
          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1.5 pr-4 shadow-sm hover:border-resi-accent/20 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-resi-accent flex items-center justify-center font-bold text-xs text-white shadow-inner">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">ID Профиля</span>
              <span className="text-[13px] font-mono font-bold text-[#0F172A] leading-none">
                {publicKey.toBase58().substring(0, 4)}...
                {publicKey.toBase58().substring(publicKey.toBase58().length - 4)}
              </span>
            </div>
            <div className="h-5 w-px bg-[#E2E8F0] mx-1"></div>
            <button
              onClick={() => disconnect()}
              className="text-[10px] font-bold text-[#EF4444] uppercase tracking-widest hover:text-[#DC2626] transition-colors bg-[#FEF2F2] p-1.5 rounded-lg border border-transparent hover:border-[#FECACA]"
              title="Отключить кошелек"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setVisible(true)}
            className="h-10 px-6 flex items-center justify-center gap-2 rounded-xl bg-resi-accent hover:opacity-90 text-white text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-resi-accent/25"
          >
            Войти в систему
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}

export default function ResidaoLayout({ children }: { readonly children: React.ReactNode }): JSX.Element {
  return (
    <ResiDaoProvider>
      <div className="fixed inset-0 z-[60] bg-[#F5F7FA] text-[#1D1D1F] overflow-hidden antialiased font-sans flex text-black">
        <ResiDaoSidebar />

        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <ResiHeader />
          <main className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
            <div className="w-full max-w-4xl mx-auto pb-12">{children}</div>
          </main>
        </div>

        <TourGuide />
      </div>
    </ResiDaoProvider>
  );
}
