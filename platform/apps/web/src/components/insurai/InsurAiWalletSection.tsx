"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function InsurAiWalletSection(): JSX.Element {
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
