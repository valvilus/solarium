"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { DashboardSidebar } from "@/components/dashboard/layout/DashboardSidebar";
import { useEffect, useState } from "react";
import { Wallet, WarningCircle, Power } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { connected, connecting, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!connected && !connecting) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <Link
          href={`/${locale}`}
          className="absolute top-8 left-8 flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path d="M16 3 L28 9.5 L16 16 L4 9.5 Z" fill="#FFFFFF" fillOpacity="0.15" />
            <path d="M4 10.5 L15.5 16.8 V29 L4 22.5 Z" fill="#FFFFFF" fillOpacity="0.5" />
            <path d="M28 10.5 L16.5 16.8 V29 L28 22.5 Z" fill="#FFFFFF" />
          </svg>
          <span className="font-unbounded tracking-widest text-[11px] uppercase text-white">Return Home</span>
        </Link>

        <div className="relative z-10 flex flex-col items-center text-center max-w-md bg-[#0A0A0A] border border-white/5 p-10 rounded-2xl shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <WarningCircle weight="fill" className="text-[#555] size-8" />
          </div>
          <h1 className="font-exo2 text-2xl font-bold text-white mb-3 tracking-tight">Access Required</h1>
          <p className="font-onest text-[#777] text-sm leading-relaxed mb-8">
            The Solarium Web3 Control Panel requires an active network connection. Complete pairing using a secure
            wallet extension like Phantom to continue viewing dashboard interfaces.
          </p>
          <button
            onClick={() => setVisible(true)}
            className="group relative flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 px-8 py-3.5 backdrop-blur-md transition-all duration-300 hover:bg-white cursor-pointer"
          >
            <Wallet weight="fill" className="mr-3 size-5 text-white/50 group-hover:text-black transition-colors" />
            <span className="font-onest font-semibold uppercase tracking-widest text-[#E2E8F0] text-[13px] group-hover:text-black transition-colors">
              {t("connectWallet")}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] bg-[#050505] flex">
      <DashboardSidebar />

      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <div className="h-16 w-full border-b border-white/5 bg-[#050505] px-10 flex items-center justify-end sticky top-0 z-[30]">
          {publicKey ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-[#10D9B0] shadow-[0_0_8px_#10D9B0]" />
                <span className="font-mono text-[12px] text-white tracking-widest uppercase">
                  {truncateAddress(publicKey.toBase58())}
                </span>
              </div>
              <button
                onClick={() => disconnect()}
                className="p-1.5 rounded-full hover:bg-white/10 text-[#555] hover:text-[#FF1515] transition-colors"
                title="Disconnect"
              >
                <Power weight="bold" className="size-5" />
              </button>
            </div>
          ) : null}
        </div>

        <main className="flex-1 px-8 lg:px-12 pt-6 pb-10 w-full">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
