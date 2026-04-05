"use client";

import { useResiDao } from "@/providers/ResiDaoProvider";

export default function ResiDaoFinance(): JSX.Element {
  const { treasuryBalance, transactions } = useResiDao();

  const totalExpenses = transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const categories = ["Ремонт", "Озеленение", "Охрана", "Уборка", "Коммуналка"] as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-black text-black tracking-tight">Отчет за Октябрь</h1>
        <div className="px-4 py-2 bg-white rounded-full border border-neutral-200 text-xs font-bold text-neutral-500 shadow-sm">
          Остаток: ${treasuryBalance.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-[32px] p-8 border border-neutral-200 shadow-sm">
        <div className="flex flex-col justify-center gap-2 border-b md:border-b-0 md:border-r border-neutral-100 pb-8 md:pb-0 pr-0 md:pr-8">
          <h2 className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest text-center md:text-left">
            Всего расходов
          </h2>
          <div className="text-5xl font-black tracking-tighter text-black text-center md:text-left">
            ${totalExpenses.toLocaleString()}
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center pl-0 md:pl-4">
          {categories.map((cat) => {
            const amount = transactions
              .filter((t) => t.category === cat && t.amount < 0)
              .reduce((acc, t) => acc + Math.abs(t.amount), 0);
            const percent = totalExpenses === 0 ? 0 : Math.round((amount / totalExpenses) * 100);
            if (amount === 0) return null;

            return (
              <div key={cat} className="flex items-center gap-3">
                <span className="w-20 text-xs font-bold text-neutral-600">{cat}</span>
                <div className="flex-1 h-3 rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full bg-resi-accent rounded-full" style={{ width: `${percent}%` }}></div>
                </div>
                <span className="w-10 text-right text-xs font-mono font-bold text-black">{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-neutral-800 tracking-tight">История транзакций</h3>
        <div className="bg-white rounded-[24px] border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
          {transactions.map((tx, idx) => (
            <div
              key={tx.id}
              className={`flex justify-between items-center p-5 hover:bg-neutral-50 transition-colors ${idx !== transactions.length - 1 ? "border-b border-neutral-100" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold text-xs">
                  {tx.category.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-black">{tx.title}</span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {tx.date} • {tx.category}
                  </span>
                </div>
              </div>
              <span className={`font-mono font-bold text-sm ${tx.amount > 0 ? "text-emerald-500" : "text-black"}`}>
                {tx.amount > 0 ? "+" : "-"}${Math.abs(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
