"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { BN } from "@coral-xyz/anchor";
import { useSolarium } from "@/hooks/useSolarium";
import { useResiDao } from "@/providers/ResiDaoProvider";
import { useLocale } from "next-intl";
import Link from "next/link";

const PRESETS = [
  {
    label: "Адекватная Цена",
    title: "Озеленение придомовой территории",
    contractor: "EcoL...9xL",
    amount: "350",
    description:
      "1. Саженцы сосны (10 шт) - $150\n2. Грунт плодородный (20 мешков) - $50\n3. Работа садовников (2 человека, 5 часов) - $150\n\nИтого: Стандартные рыночные расценки на высадку деревьев.",
  },
  {
    label: "Оверпрайс",
    title: "Замена 5 лампочек в паркинге",
    contractor: "Scam...2pM",
    amount: "4500",
    description:
      "1. Стандартная LED-лампа Philips 10W (5 шт) - $4000 ($800/шт)\n2. Использование стремянки - $100\n3. Выезд мастера высшей категории - $400\n\nИтого: Существенное завышение спецификации на 800%.",
  },
  {
    label: "Фрод",
    title: "Очистка кармы ЖК",
    contractor: "Magi...1bC",
    amount: "1500",
    description:
      "1. Выезд специалиста - $500\n2. Раскуривание благовоний у несущих стен - $200\n3. Энергетическая балансировка холла - $800\n\nИтого: Альтернативные услуги по улучшению энергоэффективности здания.",
  },
];

const PROCESSING_STEPS = [
  "Формирование IPFS Манифеста...",
  "Анализ спецификации для Оракула...",
  "Генерация криптографического хэша...",
  "Вызов Смарт-Контракта (Solana L1)...",
  "Синхронизация RPC ноды...",
];

export default function ResiDaoNewProposal(): JSX.Element {
  const router = useRouter();
  const locale = useLocale();
  const { connected } = useWallet();
  const { client } = useSolarium();
  const { addLocalProposal } = useResiDao();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contractor, setContractor] = useState("");
  const [amount, setAmount] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setTitle(preset.title);
    setContractor(preset.contractor);
    setAmount(preset.amount);
    setDescription(preset.description);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !client || !title || !description || !amount) return;

    setIsProcessing(true);
    setProcessStep(0);
    setErrorMessage(null);

    try {
      setProcessStep(1);
      const manifestPayload = {
        workerPrompt:
          "Ты строгий и независимый строительный аудитор ЖК. Твоя спецификация: СНиП РК и рыночные строительные расценки г. Алматы 2026 года. Внимательно проанализируй следующую смету от подрядчика. Если цены на оборудование или работу завышены более чем на 15% от рыночных, или смета содержит мошеннические/информационные услуги не относящиеся к ЖК, отклони её (вернув verdict: 3). Если цены рыночные и работы адекватны, одобри её (вернув verdict: 1). Обоснуй решение подробно в reasoning. ВАЖНО: verdict и confidence должны быть строго цифрами (типа number).",
        inputData: { title, description, contractor, amount: parseFloat(amount), currency: "USDT" },
        expectedSchema: {
          verdict: "number (1=Approved, 2=Suspicious, 3=Rejected)",
          confidence: "number (0-100)",
          reasoning: "string",
        },
      };

      setProcessStep(2);
      const res = await fetch("/api/ipfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manifestPayload),
      });
      const stored = await res.json();
      if (!stored.success) throw new Error("Manifest storage failed: " + stored.error);

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

      addLocalProposal({
        taskId: taskId.toString(),
        title,
        description,
        contractorAddress: contractor,
        amountUsdt: parseFloat(amount),
        votesYes: 0,
        votesTotal: 0,
        hasVoted: false,
      });

      setTimeout(() => {
        router.push(`/${locale}/apps/residao/dao`);
      }, 1000);
    } catch (err: unknown) {
      const errorMsg = String(err);
      if (errorMsg.includes("AccountNotFound") || errorMsg.includes("debit an account")) {
        setErrorMessage(
          "У вашего кошелька Phantom нет тестовых SOL для оплаты комиссии сети (AccountNotFound). Запросите Airdrop!"
        );
      } else if (errorMsg.includes("User rejected the request")) {
        setErrorMessage("Транзакция отменена вами в кошельке.");
      } else {
        setErrorMessage(`Ошибка транзакции: ${err instanceof Error ? err.message : errorMsg}`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative mb-12 pb-20">
      <div className="flex items-center gap-2 text-sm text-[#64748B] mb-8 font-medium">
        <Link href={`/${locale}/apps/residao`} className="hover:text-resi-accent transition-colors">
          OS Sunrise
        </Link>
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
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-[#0F172A] font-bold">Выставление Счета</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#0F172A] tracking-tight mb-2">Отправка Сметы на ИИ-Аудит</h1>
        <p className="text-[15px] font-medium text-[#64748B] max-w-2xl leading-relaxed">
          Вы заполняете детали выполненных работ и выставляете счет жилому комплексу. Все заявки в ResiDAO
          маршрутизируются через Solarium (AI Oracle Protocol) — независимая нейросеть проверит ваши цены на
          адекватность рынку перед голосованием жильцов.
        </p>
      </div>

      <div className="bg-[#FAFAFA] border border-[#E2E8F0] rounded-[32px] p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-resi-accent/10 flex items-center justify-center border border-resi-accent/20">
            <span className="w-2.5 h-2.5 rounded-full bg-resi-accent animate-pulse"></span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#0F172A]">
            Шаблоны для Демонстрации Жюри
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-5 py-3 bg-white border border-[#E2E8F0] hover:border-resi-accent hover:bg-resi-accent/5 rounded-[16px] text-[13px] font-bold text-[#0F172A] transition-all shadow-sm transform hover:-translate-y-0.5"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-[#E2E8F0] shadow-sm relative overflow-hidden">
        {isProcessing && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center rounded-[40px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-[#E2E8F0]">
            {!errorMessage ? (
              <>
                <div className="w-16 h-16 rounded-full border-[4px] border-resi-accent/20 border-t-resi-accent animate-spin mb-8" />
                <h3 className="text-2xl font-black mb-3 text-[#0F172A] tracking-tight">
                  Отправка данных в Блокчейн...
                </h3>
                <p className="text-sm font-mono text-resi-accent font-semibold h-6 transition-all">
                  {PROCESSING_STEPS[processStep]}
                </p>
                <div className="w-80 h-2.5 bg-[#F1F5F9] rounded-full mt-10 overflow-hidden border border-[#E2E8F0]">
                  <div
                    className="h-full bg-resi-accent transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(var(--resi-accent),0.5)]"
                    style={{ width: `${((processStep + 1) / PROCESSING_STEPS.length) * 100}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-[#FEF2F2] border-[3px] border-[#FECACA] flex items-center justify-center text-[#DC2626] shadow-sm mb-6">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#DC2626] tracking-tight">Ошибка Смарт-Контракта</h3>
                <p className="text-[13px] text-[#DC2626] font-medium max-w-lg bg-[#FEF2F2] p-6 rounded-2xl border border-[#FECACA] leading-relaxed mb-8">
                  {errorMessage}
                </p>
                <button
                  onClick={() => {
                    setIsProcessing(false);
                    setErrorMessage(null);
                  }}
                  className="px-8 py-4 rounded-xl text-[13px] uppercase tracking-widest font-bold bg-white border border-[#E2E8F0] shadow-sm hover:bg-[#F8FAFC] transition-colors text-[#0F172A]"
                >
                  Вернуться и исправить
                </button>
              </>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-10 p-10">
          <div className="relative">
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#0F172A] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#E2E8F0] text-[#64748B] flex items-center justify-center text-xs font-black">
                1
              </span>
              Основные данные сметы
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-3 md:ml-11">
              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-2 ml-1">
                  Название Объекта / Услуги
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Ремонт лифта"
                  className="h-14 w-full px-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:border-resi-accent focus:bg-white outline-none text-[15px] text-[#0F172A] font-medium shadow-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-2 ml-1">
                  Сумма Акта (USDT)
                </label>
                <input
                  required
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                  className="h-14 w-full px-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:border-resi-accent focus:bg-white outline-none text-[17px] font-mono text-[#0F172A] shadow-sm transition-all"
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#0F172A] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#E2E8F0] text-[#64748B] flex items-center justify-center text-xs font-black">
                2
              </span>
              Реквизиты B2B Подрядчика
            </h3>
            <div className="ml-3 md:ml-11">
              <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-2 ml-1">
                Solana Кошелек для зачисления оплаты
              </label>
              <input
                required
                type="text"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
                placeholder="0x..."
                className="h-14 w-full px-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl focus:border-resi-accent focus:bg-white outline-none text-[15px] font-mono text-[#0F172A] font-medium shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="relative">
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#0F172A] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#E2E8F0] text-[#64748B] flex items-center justify-center text-xs font-black">
                3
              </span>
              Детализированная Спецификация для Авто-Аудита
            </h3>

            <div className="ml-3 md:ml-11">
              <div className="flex items-center gap-2 px-3 py-2 bg-resi-accent/5 border border-resi-accent/20 rounded-xl mb-3 w-fit">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-resi-accent"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="text-[11px] font-bold uppercase tracking-widest text-resi-accent">
                  Читает Искусственный Интеллект
                </span>
              </div>

              <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-widest mb-2 ml-1">
                Подробный расчет расценок
              </label>
              <textarea
                required
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Распишите работы подробно."
                className="w-full p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl focus:border-resi-accent focus:bg-white outline-none text-[15px] text-[#0F172A] font-medium shadow-sm transition-all leading-relaxed resize-none"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-[#E2E8F0] mt-4 ml-3 md:ml-11">
            <button
              type="submit"
              disabled={!connected || isProcessing}
              className={`w-full h-16 rounded-2xl flex items-center gap-2 justify-center text-[13px] font-bold tracking-widest uppercase transition-all ${
                !connected
                  ? "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed border border-[#E2E8F0]"
                  : "bg-resi-accent hover:opacity-90 text-white shadow-xl shadow-resi-accent/20 transform hover:-translate-y-0.5"
              }`}
            >
              {!connected ? (
                "Подключите Web3 Кошелек"
              ) : (
                <>
                  Подписать и Направить в Solarium L1
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
            {connected && (
              <p className="text-center mt-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                Подписание транзакции требует $0.0001 (SOL gas)
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
