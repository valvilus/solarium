"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { useSolarium } from "@/hooks/useSolarium";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("@/components/insurai/ClaimsMapWidget"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] border border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-center flex-col">
      <div className="w-8 h-8 border-[3px] border-[rgba(5,150,105,0.15)] rounded-full border-t-[#059669] animate-spin mb-4" />
      <span className="text-xs font-bold text-slate-400">Спутник загружается...</span>
    </div>
  ),
});

type FormState = {
  id: string;
  lat: string;
  lng: string;
  start: string;
  end: string;
  comment: string;
};

const PROCESSING_STEPS = [
  "Инициализация запроса к Оракулу...",
  "Запрос метеоданных (Open-Meteo API)...",
  "Формирование IPFS Манифеста...",
  "Криптографическое хэширование данных...",
  "Вызов Смарт-Контракта (Solana L1)...",
  "Переадресация в терминал проверки...",
];

const getDates = (offsetStart: number, offsetEnd: number) => {
  const d1 = new Date();
  d1.setDate(d1.getDate() - offsetStart);
  const d2 = new Date();
  d2.setDate(d2.getDate() - offsetEnd);
  return {
    start: d1.toISOString().split("T")[0],
    end: d2.toISOString().split("T")[0],
  };
};

const getHonestPreset = (): FormState => {
  const dates = getDates(20, 5);
  return {
    id: "POL-[AGRO-DEMO]",
    lat: "15.5007",
    lng: "32.5599",
    start: dates.start,
    end: dates.end,
    comment: "Гибель 100% урожая. Дождей не было, аномальная жара более 30 градусов выжгла все посевы.",
  };
};

const getFraudPreset = (): FormState => {
  const dates = getDates(20, 5);
  return {
    id: "POL-[FRAUD-DEMO]",
    lat: "43.2561",
    lng: "76.9284",
    start: dates.start,
    end: dates.end,
    comment: "Сильная засуха уничтожила посевы. Сумма осадков была нулевой, стояла дикая жара более 30 градусов.",
  };
};

export default function ClaimSubmission(): JSX.Element {
  const router = useRouter();
  const locale = useLocale();
  const { connected } = useWallet();
  const { client } = useSolarium();

  const [form, setForm] = useState<FormState>({
    id: "POL-" + Math.floor(Math.random() * 99999),
    lat: "",
    lng: "",
    start: getDates(20, 5).start,
    end: getDates(20, 5).end,
    comment: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [weatherPreview, setWeatherPreview] = useState<{ temp: number; prec: number } | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  const applyPreset = (presetFn: () => FormState): void => {
    const f = presetFn();
    setForm(f);
    setMapCenter({ lat: parseFloat(f.lat), lng: parseFloat(f.lng) });
    setWeatherPreview(null);
  };

  const handlePolygonSet = (centroid: { lat: number; lng: number }) => {
    setForm((prev) => ({ ...prev, lat: centroid.lat.toFixed(5), lng: centroid.lng.toFixed(5) }));
    setMapCenter(centroid);
    setWeatherPreview(null);
  };

  const syncWeatherOracle = async () => {
    if (!form.lat || !form.lng || !form.start || !form.end) return;
    setIsPreviewLoading(true);
    try {
      const meteoUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${form.lat}&longitude=${form.lng}&start_date=${form.start}&end_date=${form.end}&daily=temperature_2m_max,precipitation_sum&timezone=auto`;
      const res = await fetch(meteoUrl);
      const data = await res.json();

      if (data.daily) {
        const temps = data.daily.temperature_2m_max;
        const precs = data.daily.precipitation_sum;

        const avgTemp = temps.reduce((a: number, b: number) => a + (b || 0), 0) / temps.length;
        const totalPrec = precs.reduce((a: number, b: number) => a + (b || 0), 0);

        setWeatherPreview({ temp: avgTemp, prec: totalPrec });
      } else {
        setErrorMessage("Указанные даты или координаты не поддерживаются архивом оракула.");
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("Ошибка подключения к Оракулу Open-Meteo");
    }
    setIsPreviewLoading(false);
  };

  const submitToOracle = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!connected || !client) return;

    setIsProcessing(true);
    setProcessStep(0);
    setErrorMessage(null);

    try {
      setProcessStep(0);
      const meteoUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${form.lat}&longitude=${form.lng}&start_date=${form.start}&end_date=${form.end}&daily=temperature_2m_max,precipitation_sum&timezone=auto`;
      const weatherData = await (await fetch(meteoUrl)).json();

      setProcessStep(1);
      const manifestPayload = {
        workerPrompt:
          "Вы — независимый Децентрализованный Оракул системы агрострахования. Условие полиса: выплата по засухе утверждается ТОЛЬКО ЕСЛИ средняя максимальная температура за период превышала 30°C И суммарные осадки оказались ниже 10мм. Если условия ИСТИННЫ — verdict: 1. Если нет — verdict: 3.",
        inputData: { policyId: form.id, farmerStatement: form.comment, officialWeatherData: weatherData.daily },
        expectedSchema: {
          verdict: "number (1=Approved, 3=Rejected)",
          confidence: "number (0-100)",
          reasoning: "string",
        },
      };

      setProcessStep(2);
      const ipfsRes = await fetch("/api/ipfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manifestPayload),
      });
      const stored = await ipfsRes.json();
      if (!stored.success) throw new Error("Manifest storage failed");

      setProcessStep(3);
      const inputHashArray = Array.from(Buffer.from(stored.hashHex, "hex"));

      setProcessStep(4);
      const { taskId } = await client.createTask({
        inputHash: inputHashArray,
        taskType: 0,
        tier: 3,
        reward: new BN(1_000_000),
        validatorCount: 1,
      });

      setProcessStep(5);
      setTimeout(() => {
        router.push(`/${locale}/apps/insurai/task/${taskId.toString()}`);
      }, 1200);
    } catch (err: unknown) {
      console.error(err);

      const errorMsg = String(err);
      if (
        errorMsg.includes("Attempt to debit an account but found no record of a prior credit") ||
        errorMsg.includes("Insufficient funds")
      ) {
        setErrorMessage(
          "На вашем кошельке Phantom нет тестовых SOL. Запросите Airdrop через solana CLI или в кошельке Phantom."
        );
      } else if (errorMsg.includes("User rejected the request")) {
        setErrorMessage("Транзакция отменена пользователем в кошельке.");
      } else {
        setErrorMessage(
          `Ошибка при отправке: ${err instanceof Error ? err.message : "Неизвестная ошибка платформы Solana"}`
        );
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative mb-12">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
        <span>Главная</span>
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
        <span className="text-slate-700">Все Заявки</span>
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
        <span className="text-[#059669]">Локализация Убытка (Засуха)</span>
      </div>

      <div className="mb-6 bg-white p-6 border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight mb-1">Формирование Иска (AI Oracle)</h1>
          <p className="text-sm text-slate-500 font-medium">
            Нейросеть оценит температуру и осадки по координатам фермы и вынесет вердикт.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => applyPreset(getHonestPreset)}
            className="text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            Загрузить Демо (Засуха/Судан)
          </button>
          <button
            onClick={() => applyPreset(getFraudPreset)}
            className="text-xs font-bold uppercase tracking-widest bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
          >
            Загрузить Демо (Фрод/Алматы)
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-7 relative">
        {isProcessing && (
          <div className="absolute inset-0 z-[9999] rounded-2xl bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]">
            {!errorMessage ? (
              <>
                <div className="w-10 h-10 border-[4px] border-[rgba(5,150,105,0.15)] rounded-full border-t-[#059669] animate-spin mb-6" />
                <h3 className="text-xl font-black mb-2 text-[#0F172A] tracking-tight">Отправка данных в IPFS...</h3>
                <p className="text-sm font-mono text-[#059669] font-semibold h-6 transition-all">
                  {PROCESSING_STEPS[processStep]}
                </p>
                <div className="w-64 h-2 bg-slate-100 rounded-full mt-8 overflow-hidden">
                  <div
                    className="h-full bg-[#059669] transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(5,150,105,0.5)]"
                    style={{ width: `${((processStep + 1) / PROCESSING_STEPS.length) * 100}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-500 flex items-center justify-center text-red-600 shadow-sm mb-4">
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
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-red-700 tracking-tight">Ошибка Смарт-Контракта</h3>
                <p className="text-sm text-red-600 font-medium max-w-md bg-red-50/50 p-4 rounded-xl border border-red-100 leading-relaxed mb-6">
                  {errorMessage}
                </p>
                <button
                  onClick={() => {
                    setIsProcessing(false);
                    setErrorMessage(null);
                  }}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white border-2 border-slate-200 shadow-sm hover:bg-slate-50 transition-colors text-slate-700"
                >
                  Вернуться и исправить параметры
                </button>
              </>
            )}
          </div>
        )}

        <form onSubmit={submitToOracle} className="flex flex-col gap-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#0F172A] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#0F172A] text-white flex items-center justify-center text-[10px]">
                1
              </span>
              Период Инцидента и Локация
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Дата начала
                </label>
                <input
                  required
                  type="date"
                  value={form.start}
                  onChange={(e) => {
                    setForm({ ...form, start: e.target.value });
                    setWeatherPreview(null);
                  }}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0F172A] focus:bg-white outline-none text-sm text-[#0F172A] font-medium shadow-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                  Дата окончания
                </label>
                <input
                  required
                  type="date"
                  value={form.end}
                  onChange={(e) => {
                    setForm({ ...form, end: e.target.value });
                    setWeatherPreview(null);
                  }}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0F172A] focus:bg-white outline-none text-sm text-[#0F172A] font-medium shadow-sm transition-all"
                />
              </div>
            </div>

            <InteractiveMap
              startData={form.start}
              endData={form.end}
              avgTemp={weatherPreview?.temp ?? null}
              onPolygonSet={handlePolygonSet}
              initialLat={mapCenter?.lat}
              initialLng={mapCenter?.lng}
            />
            {form.lat && form.lng && !weatherPreview && (
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mt-2 ml-1 animate-pulse">
                Координаты зафиксированы — сгенерируйте данные оракула ⬇
              </p>
            )}
          </div>

          <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-[13px] font-bold text-[#0F172A] uppercase tracking-widest flex items-center gap-2 mb-1">
                  Предварительный Оракул (Open-Meteo)
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Тепловая карта обновится после стягивания данных с метео-реестра
                </p>
              </div>
              <button
                type="button"
                onClick={syncWeatherOracle}
                disabled={!form.lat || !form.lng || !form.start || !form.end || isPreviewLoading}
                className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-[#0F172A] shadow-sm hover:border-[#0F172A] hover:text-[#0F172A] transition-colors disabled:opacity-50 disabled:hover:border-slate-200 flex items-center gap-2"
              >
                {isPreviewLoading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-slate-300 border-t-[#0F172A] rounded-full animate-spin" />{" "}
                    Вычисляем...
                  </>
                ) : (
                  "Сгенерировать сводку"
                )}
              </button>
            </div>

            {weatherPreview ? (
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-inner ${weatherPreview.temp >= 30 ? "bg-red-50/50 border-red-200" : "bg-emerald-50/50 border-emerald-200"}`}
                >
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest mb-1 ${weatherPreview.temp >= 30 ? "text-red-400" : "text-emerald-500"}`}
                  >
                    Средняя Макс. t° (Trigger &gt;30°C)
                  </span>
                  <span
                    className={`text-3xl font-black font-mono tracking-tight ${weatherPreview.temp >= 30 ? "text-red-600" : "text-emerald-700"}`}
                  >
                    {weatherPreview.temp > 0 ? "+" : ""}
                    {weatherPreview.temp.toFixed(1)}°C
                  </span>
                </div>
                <div
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-inner ${weatherPreview.prec < 10 ? "bg-amber-50/50 border-amber-200" : "bg-blue-50/50 border-blue-200"}`}
                >
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest mb-1 ${weatherPreview.prec < 10 ? "text-amber-500" : "text-blue-500"}`}
                  >
                    Осадки за период (Trigger &lt;10mm)
                  </span>
                  <span
                    className={`text-3xl font-black font-mono tracking-tight ${weatherPreview.prec < 10 ? "text-amber-600" : "text-blue-600"}`}
                  >
                    {weatherPreview.prec.toFixed(1)} мм
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-white border border-slate-200 border-dashed rounded-xl text-xs text-slate-400 font-bold uppercase tracking-widest">
                Нарисуйте ферму на карте -&gt; Нажмите «Сгенерировать сводку»
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#0F172A] mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#0F172A] text-white flex items-center justify-center text-[10px]">
                2
              </span>
              Акт Инцидента
            </h3>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
              Показания фермера (Текстом для ИИ)
            </label>
            <textarea
              required
              rows={3}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0F172A] focus:bg-white outline-none text-sm resize-none shadow-sm transition-all font-medium text-[#0F172A]"
              placeholder="Подробно опишите причину убытка, которая будет отправлена нейросети (Solarium LLM) на верификацию..."
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={!connected || isProcessing || !weatherPreview}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-md flex justify-center items-center text-[13px] hover:-translate-y-0.5 ${
                connected && !isProcessing && weatherPreview
                  ? "bg-[#059669] text-white hover:bg-[#047857] hover:shadow-lg hover:shadow-emerald-500/20"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none hover:translate-y-0"
              }`}
            >
              {connected
                ? !weatherPreview
                  ? "Сначала сгенерируйте метео-сводку 🡡"
                  : "Подписать транзакцию и направить в ИИ-Аудит"
                : "Подключите кошелек"}
            </button>
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-4">
              Gas Fee + ИИ Верификация: <span className="text-[#0F172A]">0.0001 SOL</span> (Localnet)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
