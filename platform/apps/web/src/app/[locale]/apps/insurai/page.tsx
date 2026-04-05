"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

type WeatherCode = "danger" | "warning" | "success";

type WeatherRow = {
  readonly date: string;
  readonly temp: string;
  readonly precip: string;
  readonly status: string;
  readonly code: WeatherCode;
};

type Metric = {
  readonly title: string;
  readonly value: string;
  readonly unit: string;
  readonly pct: number;
  readonly sub: string;
  readonly color: string;
};

function MiniDonut({
  percentage,
  color = "#059669",
}: {
  readonly percentage: number;
  readonly color?: string;
}): JSX.Element {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
      <circle cx="20" cy="20" r={radius} fill="transparent" stroke="#F1F5F9" strokeWidth="4" />
      <circle
        cx="20"
        cy="20"
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 20 20)"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
    </svg>
  );
}

const METRICS: readonly Metric[] = [
  {
    title: "Застрахованная Стоимость",
    value: "60 162",
    unit: "USDC",
    pct: 82,
    sub: "+12% в этом месяце",
    color: "#059669",
  },
  { title: "Активные Участки", value: "12 500", unit: "Га", pct: 65, sub: "Алматинская обл.", color: "#2563EB" },
  {
    title: "Обнаруженные Угрозы",
    value: "3",
    unit: "аномалии",
    pct: 15,
    sub: "Требует внимания оракула",
    color: "#D97706",
  },
];

const WEATHER_DATA: readonly WeatherRow[] = [
  { date: "25.03.2026", temp: "+38°C", precip: "0 мм", status: "КРИТИЧНО", code: "danger" },
  { date: "24.03.2026", temp: "+36°C", precip: "0 мм", status: "ВНИМАНИЕ", code: "warning" },
  { date: "23.03.2026", temp: "+32°C", precip: "2 мм", status: "НОРМА", code: "success" },
  { date: "22.03.2026", temp: "+29°C", precip: "5 мм", status: "НОРМА", code: "success" },
];

const STATUS_STYLES: Record<WeatherCode, string> = {
  danger: "bg-red-50 text-red-700 border border-red-100",
  warning: "bg-amber-50 text-amber-700 border border-amber-100",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
};

export default function InsurAiDashboard(): JSX.Element {
  const locale = useLocale();

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <span className="cursor-pointer hover:text-[#0F172A] transition-colors">Главная</span>
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
        <span className="text-[#0F172A] font-medium">Сводка по объектам (АПК)</span>
      </div>

      <div className="bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] rounded-2xl p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-sm">
            🇰🇿
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#0F172A]">Алматинская Область, Хозяйство &quot;Агро-Юг&quot;</h2>
            <p className="text-slate-500 text-sm mt-0.5">Руководитель: Омаров Т.С. • ID: AGRO-992-KZ</p>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            Полисы Активны
          </div>
          <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200">
            ID Контракта: 0x8f...3a1B
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {METRICS.map((m, i) => (
          <div
            key={i}
            className="bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] rounded-2xl p-6 flex justify-between items-start hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{m.title}</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-bold tracking-tight text-[#0F172A]">{m.value}</h3>
                <span className="text-sm text-slate-500 font-medium">{m.unit}</span>
              </div>
              <p className="text-xs text-slate-400 mt-3">{m.sub}</p>
            </div>
            <MiniDonut percentage={m.pct} color={m.color} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-[#0F172A]">
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
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Метеоданные Оракула
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              API: Open-Meteo
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500 border-b border-[#E2E8F0]">
                <tr>
                  <th className="pb-3 pt-2 px-2 font-medium">Дата</th>
                  <th className="pb-3 pt-2 px-2 font-medium">Макс. Темп.</th>
                  <th className="pb-3 pt-2 px-2 font-medium">Осадки</th>
                  <th className="pb-3 pt-2 px-2 font-medium text-right">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {WEATHER_DATA.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-2 text-[#0F172A] font-medium">{row.date}</td>
                    <td className="py-4 px-2 font-mono text-slate-600 group-hover:text-[#0F172A]">{row.temp}</td>
                    <td className="py-4 px-2 font-mono text-slate-600 group-hover:text-[#0F172A]">{row.precip}</td>
                    <td className="py-4 px-2 text-right">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${STATUS_STYLES[row.code]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Link
              href={`/${locale}/apps/insurai/claims/new`}
              className="w-full py-3 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm font-medium transition-all shadow-sm flex justify-center items-center gap-2 text-[#0F172A] group"
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
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
              <span className="group-hover:text-[#059669] transition-colors">
                Передать данные в ИИ для анализа (Клейм)
              </span>
            </Link>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] rounded-2xl p-6">
          <h3 className="font-semibold text-lg mb-6 text-[#0F172A]">Распределение рисков</h3>

          <div className="flex justify-center mb-8 relative">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="60" fill="transparent" stroke="#F1F5F9" strokeWidth="14" />

              <circle
                cx="80"
                cy="80"
                r="60"
                fill="transparent"
                stroke="#D97706"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="226 151"
                strokeDashoffset="94"
                transform="rotate(-90 80 80)"
              />

              <circle
                cx="80"
                cy="80"
                r="60"
                fill="transparent"
                stroke="#2563EB"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="113 264"
                strokeDashoffset="-132"
                transform="rotate(-90 80 80)"
              />

              <circle
                cx="80"
                cy="80"
                r="60"
                fill="transparent"
                stroke="#059669"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="38 339"
                strokeDashoffset="-245"
                transform="rotate(-90 80 80)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#0F172A]">100%</span>
              <span className="text-xs text-slate-500 font-medium">Покрытие</span>
            </div>
          </div>

          <div className="space-y-5">
            {[
              {
                label: "Засуха (Нарушение водн. режима)",
                pct: 60,
                color: "bg-amber-500",
                textColor: "text-amber-600",
                barW: "60%",
              },
              { label: "Аномальные заморозки", pct: 30, color: "bg-blue-500", textColor: "text-blue-600", barW: "30%" },
              {
                label: "Вредители (Саранча)",
                pct: 10,
                color: "bg-emerald-500",
                textColor: "text-emerald-600",
                barW: "10%",
              },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[#0F172A] font-medium">{item.label}</span>
                  <span className={`font-mono font-semibold ${item.textColor}`}>{item.pct}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: item.barW }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
