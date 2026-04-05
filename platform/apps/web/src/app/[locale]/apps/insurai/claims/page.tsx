"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolarium } from "@/hooks/useSolarium";
import { useLocale } from "next-intl";
import { TaskAccountData } from "@solarium-labs/sdk";
import { PublicKey } from "@solana/web3.js";

type EnrichedTask = {
  publicKey: PublicKey;
  account: TaskAccountData;
};

export default function InsurAiClaimsFeed(): JSX.Element {
  const { connected, publicKey } = useWallet();
  const { client } = useSolarium();
  const locale = useLocale();

  const [tasks, setTasks] = useState<EnrichedTask[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!client || !connected || !publicKey) return;
    let mounted = true;

    const fetchTasks = async (): Promise<void> => {
      setLoading(true);
      try {
        const allTasks = await client.program.account.taskState.all();

        const userTasks = allTasks
          .filter((t) => t.account.creator.equals(publicKey) && t.account.taskType === 0)
          .map((onchain) => ({
            publicKey: onchain.publicKey,
            account: onchain.account,
          }))
          .sort((a, b) => b.account.createdAt.toNumber() - a.account.createdAt.toNumber());

        if (mounted) setTasks(userTasks);
      } catch (err) {
        console.error("Failed to fetch claims", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [client, connected, publicKey]);

  const renderStatus = (task: TaskAccountData): JSX.Element => {
    if (
      "open" in task.status ||
      "assigned" in task.status ||
      "revealing" in task.status ||
      "optimisticFinalized" in task.status ||
      "challenged" in task.status
    ) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse" />
          Обработка Оракулом
        </span>
      );
    }
    if ("finalized" in task.status) {
      if ("approved" in task.finalVerdict) {
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
            Выплата Одобрена
          </span>
        );
      }
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" />
          Отклонено
        </span>
      );
    }
    if ("invalidated" in task.status) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
          Провалено
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-500">
        Неизвестно
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6" style={{ minHeight: "calc(100vh - 140px)" }}>
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
        <Link href={`/${locale}/apps/insurai`} className="hover:text-[#0F172A] transition-colors">
          Главная
        </Link>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-[#0F172A] font-medium">Все Страховые Заявки</span>
      </div>

      <div className="flex items-center justify-between mb-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Реестр Исков к Оракулу</h1>
          <p className="text-sm text-slate-500">Прозрачный трекинг всех поданных заявок на страховую выплату (Web3)</p>
        </div>
        <Link
          href={`/${locale}/apps/insurai/claims/new`}
          className="bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-colors flex items-center gap-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Подать Иск
        </Link>
      </div>

      {!connected ? (
        <div className="bg-white rounded-2xl p-12 border border-[#E2E8F0] text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-2">Требуется авторизация</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Подключите кошелек Solana, чтобы просматривать историю ваших страховых исков.
          </p>
        </div>
      ) : loading && tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#E2E8F0]">
          <div className="w-10 h-10 border-[3px] border-[rgba(5,150,105,0.15)] rounded-full border-t-[#059669] animate-spin mb-4"></div>
          <p className="text-sm font-bold text-slate-400">Синхронизация с контрактом Solarium...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-[#E2E8F0] text-center shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#0F172A] mb-2">Исков пока нет</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Вы еще не подавали заявки на страховую выплату к ИИ-Оракулу.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-[#E2E8F0]">
              <tr>
                <th className="py-4 px-6 font-semibold">ID Дела (On-Chain)</th>
                <th className="py-4 px-6 font-semibold">Дата Создания</th>
                <th className="py-4 px-6 font-semibold">Сумма Иска</th>
                <th className="py-4 px-6 font-semibold">Статус</th>
                <th className="py-4 px-6 font-semibold text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {tasks.map((t) => {
                return (
                  <tr key={t.account.taskId.toString()} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
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
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-[#0F172A]">Дело #{t.account.taskId.toString()}</p>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            Владелец: {t.account.creator.toBase58().slice(0, 4)}...
                            {t.account.creator.toBase58().slice(-4)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {new Date(t.account.createdAt.toNumber() * 1000).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#0F172A]">5,000 USDC</span>
                    </td>
                    <td className="py-4 px-6">{renderStatus(t.account)}</td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/${locale}/apps/insurai/task/${t.account.taskId.toString()}`}
                        className="inline-flex items-center justify-center bg-white border border-[#E2E8F0] shadow-sm hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-700 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        Открыть Терминал &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
