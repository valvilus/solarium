"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLocale } from "next-intl";
import { useResiDao } from "@/providers/ResiDaoProvider";

export default function ResiDaoDashboard(): JSX.Element {
  const { connected } = useWallet();
  const locale = useLocale();
  const { role, treasuryBalance, depositFunds, transactions, localProposals } = useResiDao();

  const isResident = role === "resident" || role === "chairman";

  const myContractorProposals = localProposals;
  const expectedPayout = myContractorProposals.reduce((sum, p) => sum + p.amountUsdt, 0);
  const aiApprovedCount = myContractorProposals.filter(
    (p) => ((p as any).status && "finalized" in (p as any).status) || p.votesTotal > 0
  ).length;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {isResident ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-[2] bg-white rounded-[40px] p-10 border border-[#E2E8F0] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-resi-accent/5 blur-[80px] rounded-bl-full pointer-events-none group-hover:bg-resi-accent/10 transition-colors duration-700"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">
                    Жилой Комплекс Подключен
                  </h2>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-[#0F172A] mb-1">OS "Sunrise"</h1>
                <p className="text-[15px] font-medium text-[#64748B]">Алматы, пр. Аль-Фараби 21</p>
              </div>

              <div className="mt-12 flex items-end justify-between">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">
                    Казначейство DAO (Фонд)
                  </h3>
                  <div className="text-5xl font-black tracking-tighter font-mono text-[#0F172A]">
                    ${treasuryBalance.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => depositFunds(25)}
                  title="Пополнить Казну (Взнос ОСИ)"
                  className="w-16 h-16 rounded-[20px] bg-resi-accent hover:opacity-90 text-white flex items-center justify-center transition-all shadow-xl shadow-resi-accent/20 transform hover:-translate-y-1"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-[1] bg-white border border-[#E2E8F0] rounded-[40px] p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-5">Навигация</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={`/${locale}/apps/residao/dao`}
                  className="aspect-square rounded-[24px] bg-[#F8FAFC] hover:bg-[#F1F5F9] flex flex-col items-center justify-center gap-3 transition-colors border border-[#E2E8F0]"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#E2E8F0]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0F172A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#475569]">Голосования</span>
                </Link>
                <Link
                  href={`/${locale}/apps/residao/finance`}
                  className="aspect-square rounded-[24px] bg-[#F8FAFC] hover:bg-[#F1F5F9] flex flex-col items-center justify-center gap-3 transition-colors border border-[#E2E8F0]"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#E2E8F0]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#475569]">Финансы</span>
                </Link>
              </div>
            </div>

            <div className="mt-8 p-5 rounded-[24px] bg-resi-accent/5 border border-resi-accent/20 flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <div className="text-[11px] font-bold uppercase tracking-widest text-resi-accent">Квитанция</div>
                <div className="w-2 h-2 rounded-full bg-resi-accent animate-pulse" />
              </div>
              <div className="text-sm font-semibold text-[#0F172A] mb-3">Ежемесячный взнос ОСИ</div>
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-resi-accent/10">
                <div className="font-black font-mono text-xl text-[#0F172A]">$25</div>
                <button
                  onClick={() => depositFunds(25)}
                  className="text-[10px] uppercase font-black text-white bg-resi-accent px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm"
                >
                  Оплатить
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[40px] p-10 border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col lg:flex-row gap-8 justify-between">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F8FAFC] rounded-bl-full pointer-events-none border-b border-l border-[#E2E8F0]"></div>

            <div className="relative z-10 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
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
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h2 className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">B2B Доход со смет</h2>
              </div>
              <div className="text-6xl font-black font-mono tracking-tighter text-[#0F172A] mb-2">
                ${expectedPayout.toLocaleString()}
              </div>
              <div className="text-[15px] font-medium text-[#94A3B8]">Совокупный объем поданных актов подрядчика</div>
            </div>

            <div className="relative z-10 flex gap-4 w-full lg:w-auto h-full items-center">
              <div className="flex-1 lg:flex-none flex flex-col items-center justify-center bg-white rounded-[24px] p-8 min-w-[160px] border border-[#E2E8F0] shadow-sm">
                <div className="text-4xl font-black font-mono text-[#0F172A] mb-2">{myContractorProposals.length}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] text-center">
                  Всего
                  <br />
                  Заявок
                </div>
              </div>
              <div className="flex-1 lg:flex-none flex flex-col items-center justify-center bg-[#F0FDF4] rounded-[24px] p-8 min-w-[160px] border border-[#BBF7D0] shadow-sm">
                <div className="text-4xl font-black font-mono text-[#059669] mb-2">{aiApprovedCount}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#059669] text-center">
                  Прошли ИИ
                  <br />
                  (Одобрено)
                </div>
              </div>
            </div>
          </div>

          <Link
            href={`/${locale}/apps/residao/new`}
            className="block w-full text-center bg-resi-accent hover:opacity-90 text-white rounded-[24px] py-5 px-8 font-bold text-[13px] uppercase tracking-widest transition-all shadow-lg shadow-resi-accent/20 transform hover:-translate-y-0.5"
          >
            Выставить новый счет ОСИ (Акт Выполненных Работ)
          </Link>
        </div>
      )}

      {isResident ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[32px] p-8 border border-[#E2E8F0] shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center border border-[#E2E8F0]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#64748B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3 className="text-[17px] font-bold tracking-tight text-[#0F172A]">Лента расходов</h3>
              </div>
              <Link
                href={`/${locale}/apps/residao/finance`}
                className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest hover:text-[#0F172A] transition-colors bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0]"
              >
                Все
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {transactions.slice(0, 3).map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center p-3 hover:bg-[#F8FAFC] rounded-2xl transition-colors border border-transparent hover:border-[#E2E8F0]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#0F172A] font-black text-xs uppercase border border-[#E2E8F0] shadow-sm">
                      {tx.category.substring(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[15px] text-[#0F172A]">{tx.category}</span>
                      <span className="text-[11px] text-[#64748B] font-medium">{tx.title}</span>
                    </div>
                  </div>
                  <span
                    className={`font-mono font-black text-[15px] ${tx.amount > 0 ? "text-[#059669]" : "text-[#0F172A]"}`}
                  >
                    {tx.amount > 0 ? "+" : "-"}${Math.abs(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-resi-accent animate-pulse"></div>
                <h3 className="text-[10px] font-bold tracking-widest text-resi-accent uppercase">Solarium AI</h3>
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-3 text-[#0F172A]">Децентрализованные Сметы</h3>
              <p className="text-[13px] text-[#64748B] font-medium leading-relaxed max-w-[320px]">
                Ваш ЖК использует нейросеть-оракул для проверки каждой транзакции от подрядчиков. Обеспечение 100%
                защиты от завышения цен. Все сметы проходят проверку консенсусом узлов перед голосованием жильцов.
              </p>
            </div>

            <div className="mt-8 relative z-10">
              <Link
                href={`/${locale}/apps/residao/dao`}
                className="inline-flex items-center justify-center w-full px-6 py-4 rounded-2xl bg-resi-accent hover:opacity-90 text-white font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-resi-accent/20 transform hover:-translate-y-0.5"
              >
                Изучить Реестр Блокчейна
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-10 border border-[#E2E8F0] shadow-sm mt-4">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#E2E8F0]">
            <h3 className="text-xl font-bold tracking-tight text-[#0F172A]">Реестр Активных Смет</h3>
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
              B2B Panel
            </span>
          </div>

          {myContractorProposals.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-[#E2E8F0] rounded-[32px] bg-[#F8FAFC]">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#94A3B8] mb-4 border border-[#E2E8F0] shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-[15px] font-bold text-[#0F172A] mb-1">Смет пока нет</p>
              <p className="text-[13px] font-medium text-[#64748B]">Ни один акт выполненных работ не был направлен.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myContractorProposals.map((p, idx) => (
                <div
                  key={p.taskId}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-[#E2E8F0] rounded-[24px] hover:shadow-md transition-all gap-4 bg-white hover:border-[#CBD5E1]"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-[#64748B] font-black text-sm border border-[#E2E8F0] shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-bold text-[17px] text-[#0F172A] mb-1 line-clamp-1">{p.title}</div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-[#94A3B8]">ID: {p.taskId.substring(0, 8)}...</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#059669] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 rounded-md">
                          AI Votes: {p.votesYes}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-[#E2E8F0]">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">
                      Запрошенная Сумма
                    </span>
                    <span className="text-2xl font-black font-mono text-[#0F172A]">
                      ${p.amountUsdt.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
