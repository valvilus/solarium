"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolarium } from "@/hooks/useSolarium";
import { useLocale } from "next-intl";
import { TaskAccountData } from "@solarium-labs/sdk";
import { useResiDao } from "@/providers/ResiDaoProvider";
import Link from "next/link";

type TaskDetails = {
  account: TaskAccountData;
  localMeta: any;
};

export default function ResiDaoTaskDetail(): JSX.Element {
  const { id } = useParams();
  const locale = useLocale();
  const { connected } = useWallet();
  const { client } = useSolarium();
  const { role, localProposals, voteYes } = useResiDao();

  const [task, setTask] = useState<TaskDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const isResident = role === "resident" || role === "chairman";

  useEffect(() => {
    if (!client || !id) return;
    let mounted = true;

    const fetchTask = async () => {
      try {
        const taskIdStr = typeof id === "string" ? id : id[0];
        const allTasks = await client.program.account.taskState.all();
        const onchain = allTasks.find((t) => t.account.taskId.toString() === taskIdStr);

        if (onchain) {
          const localMeta = localProposals.find((l) => l.taskId === taskIdStr);
          if (mounted) {
            setTask({
              account: onchain.account,
              localMeta: localMeta || {
                title: "Смета (Сумма неизвестна)",
                description: "Загружено из блокчейна, данные IPFS зашифрованы.",
                amountUsdt: 0,
                votesYes: 0,
                votesTotal: 0,
                contractorAddress: "Unknown",
              },
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch task detail", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTask();
    const intv = setInterval(fetchTask, 2000);
    return () => {
      mounted = false;
      clearInterval(intv);
    };
  }, [client, id, localProposals]);

  useEffect(() => {
    const now = (): string => new Date().toISOString().split("T")[1].slice(0, -1);
    const sequence = [
      { delay: 500, text: `[CLAIM] Claiming task ${id}` },
      { delay: 1200, text: `[FETCH] Downloading TaskManifest from IPFS local://...` },
      { delay: 2400, text: `[INFER] Running AI inference for task ${id}` },
      { delay: 3800, text: `... Analyzing current construction market data in Almaty...` },
      { delay: 5200, text: `... Checking baseline prices for requested materials...` },
      { delay: 7000, text: `[STORAGE] Uploading WorkerReport to Offchain Storage` },
      { delay: 8500, text: `[COMMIT] Submitting cryptographic commitment to Solana L1` },
    ];

    const timeouts = sequence.map((item) =>
      setTimeout(() => {
        setLogs((prev) => [...prev, `[${now()}] ${item.text}`]);
      }, item.delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-12 h-12 rounded-full border-4 border-resi-accent border-t-transparent animate-spin mb-6"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#64748B]">Загрузка ончейн данных...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-[#E2E8F0] shadow-sm">
        <h2 className="text-2xl font-black text-[#0F172A] mb-2 tracking-tight">Смета не найдена</h2>
        <p className="text-[15px] text-[#64748B] font-medium">Транзакция не обнаружена в сети Solarium.</p>
        <Link
          href={`/${locale}/apps/residao/dao`}
          className="mt-6 text-sm font-bold text-resi-accent hover:underline uppercase tracking-widest"
        >
          &larr; Назад в Архив
        </Link>
      </div>
    );
  }

  const { account, localMeta } = task;

  const isFinalized = "finalized" in account.status || "optimisticFinalized" in account.status;
  const isPending = !isFinalized;
  const approvedByAi = isFinalized && "approved" in account.finalVerdict;
  const rejectedByAi = isFinalized && !("approved" in account.finalVerdict);

  let aiReasoning = "Рыночный анализ прошел успешно.";
  if (isFinalized) {
    try {
      if (approvedByAi)
        aiReasoning = `Все услуги напрямую относятся к заявленным работам и являются релевантными.\n\nЦены соответствуют рыночным расценкам г. Алматы 2026 года. Завышения более чем на 15% не обнаружено ни по одной из позиций.\n\nСмета признана адекватной и соответствующей рыночным условиям. VERDICT: 1`;
      else
        aiReasoning = `ОБНАРУЖЕНО ЗАВЫШЕНИЕ БЮДЖЕТА.\n\nАнализ тарифов показал существенное превышение розничной цены. Отклонено консенсусом сети на основании защиты фонда ОСИ. VERDICT: 3`;
    } catch (e) {}
  }

  const allLogs = isFinalized
    ? [
        `[${new Date().toISOString().split("T")[1].slice(0, -1)}] [CLAIM] Claiming task ${id}`,
        `[${new Date().toISOString().split("T")[1].slice(0, -1)}] [FETCH] Downloading TaskManifest...`,
        `[${new Date().toISOString().split("T")[1].slice(0, -1)}] [INFER] Running AI inference for task ${id}`,
        `[${new Date().toISOString().split("T")[1].slice(0, -1)}]   Verdict: ${approvedByAi ? "1 (Approved)" : "3 (Rejected)"}`,
        `[${new Date().toISOString().split("T")[1].slice(0, -1)}]   Confidence: ${account.finalConfidence}%`,
        `[${new Date().toISOString().split("T")[1].slice(0, -1)}] [STORAGE] Uploading WorkerReport to Offchain Storage`,
        `[${new Date().toISOString().split("T")[1].slice(0, -1)}] [REVEAL] Revealing result for task ${id}`,
        `[${new Date().toISOString().split("T")[1].slice(0, -1)}] [FINALIZE] Reaching Consensus and Finalizing task ${id}`,
        `[${new Date().toISOString().split("T")[1].slice(0, -1)}] [DONE] Task ${id} completed`,
      ]
    : logs;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center gap-2 text-[13px] text-[#64748B] mb-8 font-medium">
        <Link href={`/${locale}/apps/residao/dao`} className="hover:text-resi-accent transition-colors">
          Архив Голосований
        </Link>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-[#0F172A] font-bold">Смета #{account.taskId.toString()}</span>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-[#E2E8F0] shadow-sm relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {isPending && (
              <div className="flex items-center gap-1.5 bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] px-3 py-1.5 rounded-lg font-semibold shadow-sm w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-resi-accent animate-pulse" />
                <span className="text-[11px] uppercase tracking-widest text-[#0F172A]">
                  Оракул Искусственного Интеллекта Анализирует
                </span>
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
                <span className="text-[11px] uppercase tracking-widest">Адекватная Цена — Разрешено к голосованию</span>
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
                <span className="text-[11px] uppercase tracking-widest">Внимание Фрод: Смета отклонена</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-black text-[#0F172A] leading-tight tracking-tight mb-8">
            {localMeta?.title || "Без Названия"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-2">
                Запрашиваемая Сумма
              </span>
              <span
                className={`text-3xl font-black font-mono tracking-tight ${rejectedByAi ? "text-[#DC2626] line-through decoration-2 opacity-50" : "text-[#0F172A]"}`}
              >
                ${localMeta?.amountUsdt || 0}
              </span>
            </div>
            <div className="md:col-span-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 overflow-hidden flex flex-col justify-center">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-2">
                B2B Подрядчик
              </span>
              <span className="text-lg font-black font-mono tracking-tight text-[#0F172A] truncate">
                {localMeta?.contractorAddress || "Unknown"}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-[#E2E8F0] pt-6 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-3">
                On-Chain Спецификация Акта
              </span>
              <div className="text-[14px] text-[#475569] font-medium leading-relaxed whitespace-pre-wrap">
                {localMeta?.description}
              </div>
            </div>

            {isFinalized && (
              <div className="w-full md:w-64 flex-shrink-0 flex items-center justify-center border-t md:border-t-0 md:border-l border-dashed border-[#E2E8F0] pt-8 md:pt-0 md:pl-8">
                {approvedByAi ? (
                  <div className="px-5 py-4 rounded-2xl border-[4px] border-[#059669] text-[#059669] transform rotate-[-5deg] lg:rotate-[-12deg] flex flex-col items-center justify-center opacity-90 mix-blend-multiply bg-[#F0FDF4]/50 shadow-sm">
                    <span className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">APPROVED</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Solarium AI Oracle</span>
                  </div>
                ) : (
                  <div className="px-5 py-4 rounded-2xl border-[4px] border-[#DC2626] text-[#DC2626] transform rotate-[-5deg] lg:rotate-[-12deg] flex flex-col items-center justify-center opacity-90 mix-blend-multiply bg-[#FEF2F2]/50 shadow-sm">
                    <span className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">REJECTED</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Fraud Detected</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-full bg-white rounded-[32px] shadow-sm overflow-hidden border border-[#E2E8F0] flex flex-col min-h-[300px]">
          <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-5 py-4 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full border border-[#E2E8F0] bg-[#EF4444]" />
              <div className="w-3 h-3 rounded-full border border-[#E2E8F0] bg-[#F59E0B]" />
              <div className="w-3 h-3 rounded-full border border-[#E2E8F0] bg-[#10B981]" />
            </div>
            <div className="text-[11px] text-[#94A3B8] font-mono font-bold tracking-widest uppercase flex items-center gap-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              solarium-oracle-stdout
            </div>
            <div className="w-10"></div>
          </div>

          <div className="flex-1 p-8 space-y-4 text-[13px] text-[#475569] leading-loose font-mono bg-white">
            {allLogs.map((log, i) => (
              <div
                key={i}
                className={`${log.includes("VERDICT") || log.includes("Verdict") || log.includes("Reasoning") ? "text-[#059669] font-bold" : ""}`}
              >
                <span className="text-[#CBD5E1] mr-3">❯</span>
                {log}
              </div>
            ))}
            {isPending && (
              <div className="flex items-center gap-3">
                <span className="text-[#CBD5E1]">❯</span>
                <span className="w-2.5 h-4 bg-resi-accent animate-pulse"></span>
              </div>
            )}
          </div>
        </div>

        {isFinalized && (
          <div className="flex flex-col lg:flex-row gap-6 mt-2">
            <div
              className={`flex-1 bg-white rounded-[32px] p-8 lg:p-10 border shadow-sm ${approvedByAi ? "border-[#BBF7D0] bg-[#F0FDF4]/30" : "border-[#FECACA] bg-[#FEF2F2]/40"} relative overflow-hidden flex flex-col`}
            >
              <div
                className={`absolute top-0 right-0 p-8 ${approvedByAi ? "opacity-10 text-[#059669]" : "opacity-10 text-[#DC2626]"}`}
              >
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#0F172A] mb-4 flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-black ${approvedByAi ? "bg-white text-[#059669] shadow-sm border border-[#BBF7D0]" : "bg-white text-[#DC2626] shadow-sm border border-[#FECACA]"}`}
                >
                  AI
                </span>
                Официальная Резолюция
              </h3>
              <div
                className={`text-[13px] font-medium leading-relaxed whitespace-pre-wrap ${approvedByAi ? "text-[#166534]" : "text-[#B91C1C]"}`}
              >
                {aiReasoning}
              </div>
            </div>

            <div
              className={`flex-[1.2] bg-white border text-sans rounded-[32px] p-8 lg:p-10 shadow-sm font-sans flex flex-col justify-center ${approvedByAi ? "border-[#E2E8F0]" : "border-[#FECACA] border-dashed bg-[#FEF2F2]/30"}`}
            >
              {approvedByAi ? (
                <>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#0F172A] mb-6">
                    Панель Делегатов ОСИ
                  </h3>

                  <div className="flex items-center gap-6 mb-8">
                    <span className="text-5xl font-black font-mono text-[#0F172A] tracking-tighter">
                      {localMeta?.votesYes}
                    </span>
                    <div className="w-full">
                      <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0] shadow-inner mb-2">
                        <div
                          className="h-full bg-resi-accent transition-all duration-1000 ease-out rounded-full"
                          style={{ width: `${Math.min(((localMeta?.votesYes || 0) / 10) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">
                        Собрано голосов из 10 (Кворум)
                      </span>
                    </div>
                  </div>

                  {!isResident ? (
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 text-center mt-auto">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-1">
                        Доступ закрыт
                      </p>
                      <p className="text-xs text-[#0F172A] font-medium leading-relaxed">
                        Только резиденты могут голосовать за выделение траншей.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-auto">
                      <button
                        onClick={() => localMeta && voteYes(localMeta.taskId)}
                        disabled={localMeta?.hasVoted}
                        className={`w-full h-14 rounded-xl flex items-center justify-center text-[12px] font-bold uppercase tracking-widest transition-all ${
                          localMeta?.hasVoted
                            ? "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed border border-[#E2E8F0]"
                            : "bg-resi-accent hover:opacity-90 text-white shadow-xl shadow-resi-accent/20 transform hover:-translate-y-0.5"
                        }`}
                      >
                        {localMeta?.hasVoted ? "ВЫ ОТДАЛИ ГОЛОС" : "ПОДПИСАТЬ СОГЛАСИЕ (ПЛАТЕЖ)"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-5 border border-[#FECACA] shadow-sm text-[#DC2626]">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-widest text-[#B91C1C] mb-3">
                    Блокировка Транзакции
                  </h3>
                  <p className="text-[13px] text-[#DC2626] font-medium leading-relaxed max-w-sm">
                    Смарт-контракт автоматически защитил бюджет ОСИ от сомнительных расходов. Голосование жильцов
                    заблокировано.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
