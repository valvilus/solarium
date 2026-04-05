"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

const SatelliteMap = dynamic(() => import("@/components/insurai/InsurAiSatelliteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl border border-[#E2E8F0] bg-slate-100 flex items-center justify-center min-h-[500px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-[3px] border-[rgba(5,150,105,0.15)] rounded-full border-t-[#059669] animate-spin" />
        <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Загрузка карты...</span>
      </div>
    </div>
  ),
});

type SelectedArea = {
  readonly lat: number;
  readonly lng: number;
  readonly areaHa: number;
};

export default function Marketplace(): JSX.Element {
  const { connected } = useWallet();
  const [selectedArea, setSelectedArea] = useState<SelectedArea | null>(null);
  const [price, setPrice] = useState(0);

  const handleAreaSelect = (centroid: { lat: number; lng: number }, areaHa: number): void => {
    setSelectedArea({ lat: centroid.lat, lng: centroid.lng, areaHa });
    setPrice(Math.round(areaHa * 3.5) + 20);
  };

  return (
    <div className="flex flex-col gap-0" style={{ height: "calc(100vh - 140px)" }}>
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
        <span className="text-[#0F172A] font-medium">Покупка Полиса (Маркетплейс)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[500px]">
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] rounded-2xl p-6 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-6 text-[#0F172A]">Конфигуратор Полиса</h2>

          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className="text-sm text-[#0F172A] font-medium">1. Участок на карте</label>
              <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl flex items-center gap-3 text-slate-400 shadow-sm">
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
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {selectedArea ? (
                  <div className="flex flex-col">
                    <span className="font-mono text-sm text-[#0F172A] font-medium">
                      {selectedArea.lat.toFixed(4)}, {selectedArea.lng.toFixed(4)}
                    </span>
                    <span className="text-xs text-[#059669] font-semibold mt-0.5">
                      Площадь: {selectedArea.areaHa.toFixed(1)} Га
                    </span>
                  </div>
                ) : (
                  <span className="font-mono text-sm">Выделите участок на карте...</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#0F172A] font-medium">2. Тип культуры</label>
              <select className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-sm outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] appearance-none shadow-sm cursor-pointer text-[#0F172A]">
                <option>Озимая Пшеница</option>
                <option>Кукуруза кормовая</option>
                <option>Яблоневый Сад (Апорт)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#0F172A] font-medium">Условия триггера смарт-контракта</label>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800 font-bold mb-1">Экстремальная Засуха</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Температура &gt;35°C на срок от 10 дней подряд.
                  <br />
                  Источник: Оракул Open-Meteo.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500 font-medium">Сумма покрытия</span>
              <span className="font-semibold text-[#0F172A]">5 000 USDC</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[#0F172A] font-medium">Стоимость Полиса</span>
              <span className="text-3xl font-bold font-mono text-[#059669]">
                {selectedArea ? price : "—"} <span className="text-xl">USDC</span>
              </span>
            </div>
            <button
              disabled={!selectedArea || !connected}
              className={`w-full py-3.5 rounded-xl font-semibold transition-all shadow-sm ${
                selectedArea && connected
                  ? "bg-[#059669] text-white hover:bg-[#047857] hover:shadow-md cursor-pointer"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
              }`}
            >
              {connected ? "Оплатить (Смарт-Контракт)" : "Подключите кошелек"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 h-full min-h-[500px]">
          <SatelliteMap onAreaSelect={handleAreaSelect} />
        </div>
      </div>
    </div>
  );
}
