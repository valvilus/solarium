"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSolarium } from "@/hooks/useSolarium";
import { BN } from "@coral-xyz/anchor";
import { TaskAccountData } from "@solarium-labs/sdk";

type VerdictStatus = "processing" | "approved" | "rejected";

export default function InsurAiOracleReport(): JSX.Element {
  const { id } = useParams() as { id: string };
  const { client } = useSolarium();
  const router = useRouter();

  const [task, setTask] = useState<TaskAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!client || !id) return;

    let mounted = true;
    const fetchTask = async (): Promise<void> => {
      try {
        const tObj = await client.fetchTask(new BN(id));
        if (mounted) setTask(tObj);
      } catch (err) {
        console.error("Failed to fetch task details", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTask();
    const interval = setInterval(fetchTask, 2000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [client, id]);

  useEffect(() => {
    const now = (): string => new Date().toISOString().split("T")[1].slice(0, -1);
    const sequence = [
      { delay: 500, text: `INIT TASK_ID: ${id}` },
      { delay: 1200, text: `FETCH IPFS_MANIFEST: QmXa...9xZp` },
      { delay: 2400, text: `CONNECT OPEN_METEO_API [analyzing coords...]` },
      { delay: 3800, text: `ANALYZING CLIMATE DATA...` },
      { delay: 5200, text: `RUNNING LLM INFERENCE (Gemini)...` },
      { delay: 6600, text: `COMMITTING VERDICT TO SOLANA...` },
    ];

    const timeouts = sequence.map((item) =>
      setTimeout(() => {
        setLogs((prev) => [...prev, `[${now()}] INFO: ${item.text}`]);
      }, item.delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [id]);

  if (loading && !task) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-20">
        <div className="w-10 h-10 border-[3px] border-[rgba(5,150,105,0.15)] rounded-full border-t-[#059669] animate-spin mb-4" />
        <p className="text-sm font-bold tracking-widest uppercase text-slate-400">Синхронизация с реестром...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium bg-white rounded-2xl mx-auto max-w-xl border border-[#E2E8F0]">
        Запись об инциденте не найдена в реестре
      </div>
    );
  }

  const isFinalized = "finalized" in task.status || "optimisticFinalized" in task.status;
  const isInvalid = "invalidated" in task.status;
  const isApproved = isFinalized && "approved" in task.finalVerdict;

  const verdictStatus: VerdictStatus = !isFinalized && !isInvalid ? "processing" : isApproved ? "approved" : "rejected";

  const allLogs = isFinalized
    ? [...logs, `[${new Date().toISOString().split("T")[1].slice(0, -1)}] SUCCESS: VERDICT_GENERATED`]
    : logs;

  return (
    <div className="flex flex-col gap-4" style={{ height: "calc(100vh - 140px)" }}>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-slate-500 hover:text-[#0F172A] transition-colors text-sm mb-2 font-medium w-fit"
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
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Вернуться к Сводке
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[500px]">
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] rounded-2xl p-6 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold w-full text-left mb-6 border-b border-[#E2E8F0] pb-4 text-[#0F172A]">
            Дело #{id}
          </h2>

          <div className="w-full flex justify-between text-sm mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-left">
              <p className="text-slate-500 font-medium mb-1">Заявитель</p>
              <p className="font-mono text-xs font-semibold text-slate-700">
                {task.creator.toBase58().slice(0, 4)}...{task.creator.toBase58().slice(-4)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 font-medium mb-1">Сумма Иска</p>
              <p className="font-bold text-[#0F172A]">5,000 USDC</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {verdictStatus === "processing" && (
              <>
                <div className="w-10 h-10 border-[3px] border-[rgba(5,150,105,0.15)] rounded-full border-t-[#059669] animate-spin mb-6" />
                <h3 className="text-lg font-bold mb-2 text-[#0F172A]">Анализ Запроса</h3>
                <p className="text-sm text-slate-500 px-4 leading-relaxed">
                  ИИ-Агент связывается с гос. метеорологическим реестром и сверяет данные со смарт-контрактом.
                </p>
              </>
            )}
            {verdictStatus === "approved" && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-sm">
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
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold px-6 py-2.5 rounded-lg tracking-wide text-sm shadow-sm">
                  ВЫПЛАТА ОДОБРЕНА
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  Уверенность Нейросети:{" "}
                  <span className="text-[#0F172A] font-mono font-bold">{task.finalConfidence}%</span>
                </p>
                <button className="flex items-center gap-2 text-xs font-semibold bg-white px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm text-slate-700">
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
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Квитанция в Solana Explorer
                </button>
              </div>
            )}
            {verdictStatus === "rejected" && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-500 flex items-center justify-center text-red-600 shadow-sm">
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
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <div className="border border-red-200 bg-red-50 text-red-700 font-bold px-6 py-2.5 rounded-lg tracking-wide text-sm shadow-sm">
                  ОТКЛОНЕНО (ФРОД)
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  Уверенность Нейросети:{" "}
                  <span className="text-[#0F172A] font-mono font-bold">{task.finalConfidence}%</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 bg-slate-50 border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] rounded-2xl flex flex-col overflow-hidden">
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
            <div>
              <h3 className="font-bold text-[15px] text-[#0F172A]">Журнал Аудита (Audit Trail)</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Протокол Solarium AI</p>
            </div>
            <span
              className={`flex items-center text-xs font-bold font-mono px-3 py-1.5 rounded-md border ${
                verdictStatus === "processing"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2.5 ${verdictStatus === "processing" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
              />
              {verdictStatus === "processing" ? "В ОБРАБОТКЕ" : "АНАЛИЗ ЗАВЕРШЕН"}
            </span>
          </div>

          <div className="flex-1 p-6 font-mono text-xs md:text-sm text-slate-600 overflow-y-auto space-y-3">
            {allLogs.map((log, i) => (
              <div key={i} className="border-l-2 border-slate-300 pl-3 py-0.5">
                {log}
              </div>
            ))}

            {verdictStatus !== "processing" && (
              <div className="mt-8 pt-8 border-t border-slate-200">
                <p className="text-[#0F172A] font-sans font-bold mb-4 text-[15px] flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#059669]"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Официальное Заключение ИИ-Алгоритма:
                </p>

                {verdictStatus === "approved" ? (
                  <div className="text-slate-700 font-sans leading-relaxed text-sm bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <p>
                      На основе полученных данных из Open-Meteo за указанный период зафиксирована максимальная
                      температура воздуха <strong className="text-[#0F172A]">+38.4°C</strong> в течение 12 дней подряд.
                      Уровень осадков составил <strong className="text-[#0F172A]">0 мм</strong>.
                    </p>
                    <div className="h-px bg-slate-100" />
                    <p>
                      Условия смарт-контракта (Триггер: Экстремальная Засуха, T &gt;35°C на срок &gt;10 дней){" "}
                      <strong className="text-emerald-600">ВЫПОЛНЕНЫ</strong>. Аномалия подтверждена историческими
                      климатическими паттернами.
                    </p>
                    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-emerald-700 font-mono text-xs font-semibold flex items-center gap-2">
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
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      ТРАНЗАКЦИЯ ИСПОЛНЕНА: 5,000 USDC ПЕРЕВЕДЕНЫ ФЕРМЕРУ
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-700 font-sans leading-relaxed text-sm bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <p>
                      Заявлено наступление страхового случая в указанный период. Анализ телеметрии Open-Meteo показывает
                      данные, <strong className="text-[#0F172A]">не соответствующие</strong> параметрам триггера полиса.
                    </p>
                    <div className="h-px bg-slate-100" />
                    <p>
                      Условия смарт-контракта <strong className="text-red-600">НЕ ВЫПОЛНЕНЫ</strong>. Выявлено явное
                      несоответствие заявки фактическим метеорологическим данным.
                    </p>
                    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-red-700 font-mono text-xs font-semibold flex items-center gap-2">
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
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      МОШЕННИЧЕСТВО ЗАФИКСИРОВАНО. ВЫПЛАТА ОТКЛОНЕНА.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
