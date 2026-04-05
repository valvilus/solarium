"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolarium } from "@/hooks/useSolarium";
import { useLocale } from "next-intl";
import { TaskAccountData } from "@solarium-labs/sdk";
import { PublicKey } from "@solana/web3.js";
import { useResiDao, LocalProposal } from "@/providers/ResiDaoProvider";

type EnrichedTask = {
  publicKey: PublicKey;
  account: TaskAccountData;
  localMeta?: LocalProposal;
};

export default function ResiDaoProposalsFeed(): JSX.Element {
  const { connected } = useWallet();
  const { client } = useSolarium();
  const locale = useLocale();
  const { role, localProposals } = useResiDao();

  const [tasks, setTasks] = useState<EnrichedTask[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!client) return;
    let mounted = true;

    const fetchTasks = async (): Promise<void> => {
      setLoading(true);
      try {
        const allTasks = await client.program.account.taskState.all();

        const enriched: EnrichedTask[] = localProposals
          .map((local) => {
            const onchain = allTasks.find((t) => t.account.taskId.toString() === local.taskId);
            return {
              publicKey: onchain ? onchain.publicKey : PublicKey.default,
              account: onchain ? onchain.account : (null as any),
              localMeta: local,
            };
          })
          .filter((t) => t.account !== null)
          .sort((a, b) => b.account.taskId.toNumber() - a.account.taskId.toNumber());

        if (mounted) setTasks(enriched);
      } catch (err) {
        console.error("Failed to fetch proposals", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [client, localProposals]);

  const renderTaskCard = (t: EnrichedTask) => {
    const isPending =
      "open" in t.account.status ||
      "assigned" in t.account.status ||
      "revealing" in t.account.status ||
      "challenged" in t.account.status;

    const isFinalized = "finalized" in t.account.status || "optimisticFinalized" in t.account.status;
    const approvedByAi = isFinalized && "approved" in t.account.finalVerdict;
    const rejectedByAi = isFinalized && !("approved" in t.account.finalVerdict);

    return (
      <Link
        href={`/${locale}/apps/residao/task/${t.account.taskId.toString()}`}
        key={t.account.taskId.toString()}
        className={`bg-white rounded-[32px] flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl shadow-sm overflow-hidden border ${rejectedByAi ? "border-[#FECACA] shadow-[#FEF2F2]" : "border-[#E2E8F0]"}`}
      >
        <div className="p-8 pb-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-[#94A3B8]">
                  {new Date(t.account.createdAt.toNumber() * 1000).toLocaleDateString("ru-RU")}
                </div>
                <div className="font-black text-2xl mb-1 line-clamp-2 pr-4 text-[#0F172A] leading-tight">
                  {t.localMeta?.title || "Обработка Сметы"}
                </div>
                <div className="text-[11px] font-mono font-medium text-[#94A3B8] mb-4">
                  Поток #{t.account.taskId.toString()}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {isPending && (
                <div className="flex items-center gap-1.5 bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] px-3 py-1.5 rounded-lg font-semibold shadow-sm w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-resi-accent animate-pulse" />
                  <span className="text-[11px] uppercase tracking-widest text-[#0F172A]">AI Анализирует...</span>
                </div>
              )}
              {isFinalized && approvedByAi && (
                <div className="flex items-center gap-1.5 bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] px-3 py-1.5 rounded-lg font-semibold w-fit shadow-sm">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[11px] uppercase tracking-widest">Адекватная Цена</span>
                </div>
              )}
              {isFinalized && rejectedByAi && (
                <div className="flex items-center gap-1.5 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] px-3 py-1.5 rounded-lg font-semibold w-fit shadow-sm">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span className="text-[11px] uppercase tracking-widest">Фрод: Отклонено</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex flex-col border-t border-[#E2E8F0] pt-5">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${rejectedByAi ? "text-[#DC2626]" : "text-[#64748B]"}`}
              >
                Сумма к оплате (USDT):
              </span>
              <span
                className={`text-4xl font-black font-mono tracking-tighter ${rejectedByAi ? "text-[#DC2626] line-through decoration-2 opacity-60" : "text-[#0F172A]"}`}
              >
                ${t.localMeta?.amountUsdt || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-end justify-between mb-8 pb-6 border-b border-[#E2E8F0]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-resi-accent/10 border border-resi-accent/20 rounded-full shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-resi-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-resi-accent">
              Decentralized Autonomous Organization
            </span>
          </div>
          <h1 className="text-4xl font-black text-[#0F172A] tracking-tight mb-3">Архив Смарт-Голосований</h1>
          <p className="text-[15px] text-[#64748B] font-medium leading-relaxed">
            Безопасный мульти-сиг кошелек. Каждая публикуемая смета автоматически проверяется на адекватность рыночным
            ценам с помощью независимой нейросети-оракула Solarium. Нажмите на карточку для просмотра досье.
          </p>
        </div>
      </div>

      {!connected ? (
        <div className="bg-white rounded-[40px] p-24 border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-[#F1F5F9] text-[#64748B] rounded-[24px] flex items-center justify-center mb-8 border border-[#E2E8F0]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] mb-4 tracking-tight">Кабинет Инвестора (Жителя)</h2>
          <p className="text-[15px] text-[#64748B] max-w-sm text-center font-medium leading-relaxed">
            Подключите свой Web3 кошелек, чтобы просматривать детализированные сметы и голосовать.
          </p>
        </div>
      ) : loading && tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#FAFAFA] rounded-[40px] border border-[#E2E8F0] shadow-inner">
          <div className="w-8 h-8 rounded-full border-4 border-resi-accent border-t-transparent animate-spin mb-6"></div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#64748B]">
            Синхронизация с Solarium L1...
          </p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-[40px] p-24 border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-[#F8FAFC] text-[#94A3B8] rounded-[24px] border border-[#E2E8F0] flex items-center justify-center mb-8">
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] mb-2 tracking-tight">Лента пуста</h2>
          <p className="text-[15px] text-[#64748B] max-w-xs text-center font-medium leading-relaxed">
            Подрядчики еще не загрузили ни одной сметы для данного жилого комплекса.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 auto-rows-max items-stretch">
          {tasks.map((t) => renderTaskCard(t))}
        </div>
      )}
    </div>
  );
}
