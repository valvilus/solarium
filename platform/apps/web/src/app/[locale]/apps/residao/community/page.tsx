"use client";

import { useResiDao } from "@/providers/ResiDaoProvider";

export default function ResiDaoCommunity(): JSX.Element {
  const { residents, role } = useResiDao();
  const isChairman = role === "chairman";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-black text-black tracking-tight">Жители дома</h1>
        <div className="px-4 py-2 bg-resi-accent/10 rounded-full border border-resi-accent/20 text-xs font-bold text-resi-accent shadow-sm">
          Всего квартир: 180
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-8 border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-center mb-4">
        <div className="flex-1">
          <h2 className="text-sm font-bold text-neutral-800 tracking-tight mb-2">
            Управление доступом в DAO (Закрытое сообщество)
          </h2>
          <p className="text-xs text-neutral-500 font-medium leading-relaxed">
            Только верифицированные собственники могут участвовать в голосованиях и видеть бюджет дома. Выдавайте
            приглашения персонально.
          </p>
        </div>
        {isChairman ? (
          <button className="h-12 px-6 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shrink-0 shadow-lg">
            Сгенерировать Invite Link
          </button>
        ) : (
          <div className="p-3 bg-neutral-100 rounded-xl text-xs font-bold text-neutral-400 uppercase tracking-widest text-center border border-dashed border-neutral-300">
            АДМИН ДОСТУП ПРЕДСЕДАТЕЛЯ
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-neutral-800 tracking-tight mb-2">
          Зарегистрированные Участники (Узлы DAO)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {residents.map((r) => (
            <div
              key={r.id}
              className="bg-white p-5 rounded-[24px] border border-neutral-200 shadow-sm flex items-center justify-between"
            >
              <div className="flex gap-4 items-center">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black ${
                    r.role === "Председатель" ? "bg-resi-accent/10 text-resi-accent" : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {r.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-black">{r.name}</span>
                  <span className="text-xs text-neutral-500">{r.apartment}</span>
                </div>
              </div>

              <span
                className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                  r.role === "Председатель" ? "bg-resi-accent text-white shadow-sm" : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {r.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
