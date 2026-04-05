"use client";

import { useResiDao } from "@/providers/ResiDaoProvider";

const TOUR_STEPS = [
  {
    title: "Личный кабинет Председателя",
    description: "Здесь вы видите общий баланс ОСИ и быстрые действия. Все прозрачно для каждого жителя дома.",
  },
  {
    title: "Аудит нейросетью",
    description:
      "На странице Голосований (DAO) сметы подрядчиков проходят проверку нейросетью Solarium. ИИ ищет завышения цен прежде чем выдать смету на голосование.",
  },
  {
    title: "Кабинет Подрядчика",
    description: "Переключите роль, чтобы увидеть B2B портал. Отсюда бизнес сдает акты и сметы на проверку.",
  },
];

export function TourGuide(): JSX.Element | null {
  const { tourActive, tourStep, setTourStep, setTourActive } = useResiDao();

  if (!tourActive) return null;

  const current = TOUR_STEPS[tourStep];

  const handleNext = () => {
    if (tourStep === TOUR_STEPS.length - 1) {
      setTourActive(false);
      setTourStep(0);
    } else {
      setTourStep(tourStep + 1);
    }
  };

  const handleClose = () => {
    setTourActive(false);
    setTourStep(0);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={handleClose}
      ></div>

      <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl border border-neutral-100 pointer-events-auto animate-fadeIn m-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-black text-resi-accent text-sm uppercase tracking-widest">{current.title}</h3>
          <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-2 py-1 rounded-lg">
            {tourStep + 1}/{TOUR_STEPS.length}
          </span>
        </div>
        <p className="text-neutral-600 text-[15px] font-medium leading-relaxed mb-8">{current.description}</p>

        <div className="flex justify-between items-center">
          <button
            onClick={handleClose}
            className="text-xs font-bold text-neutral-400 hover:text-neutral-800 transition-colors uppercase tracking-widest"
          >
            Закрыть
          </button>
          <button
            onClick={handleNext}
            className="bg-resi-accent hover:bg-resi-hover text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-resi-accent/30 transition-all transform hover:-translate-y-0.5"
          >
            {tourStep === TOUR_STEPS.length - 1 ? "ЗАВЕРШИТЬ" : "СЛЕДУЮЩИЙ ШАГ &rarr;"}
          </button>
        </div>
      </div>
    </div>
  );
}
