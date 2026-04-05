import Link from "next/link";

export default function InsurAiLanding(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#111827] font-sans selection:bg-[#059669]/20">
      <nav className="fixed top-0 left-0 right-0 h-24 bg-[#FDFDFD]/90 backdrop-blur-xl z-[100] flex items-center justify-between px-8 lg:px-16 border-b border-[#E5E7EB]/50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#059669] flex items-center justify-center text-white">
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
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold text-[#111827] tracking-tight">InsurAI</span>
            <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-[#6B7280] bg-[#F3F4F6] px-2 py-1 rounded-full">
              Solarium Network
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[13px] font-bold uppercase tracking-widest text-[#4B5563] hover:text-[#111827] transition-colors"
          >
            Solarium Core
          </Link>
          <div className="h-6 w-px bg-[#E5E7EB]"></div>
          <Link
            href="/ru/apps/insurai"
            className="px-6 py-3 bg-[#111827] text-white text-[13px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#1F2937] transition-all flex items-center gap-2"
          >
            Вход в DApp
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
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </nav>

      <section className="pt-40 pb-24 px-8 lg:px-16 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 flex flex-col items-start pr-0 lg:pr-12">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-[#F0FDF4] border border-[#DCFCE7] text-[#166534] text-[11px] font-bold uppercase tracking-widest rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            Производственная среда активна
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-[-0.03em] text-[#111827] leading-[1.05] mb-8">
            Будущее <br />
            агро-страхования.
            <span className="block text-[#6B7280] mt-2">Без страховщиков.</span>
          </h1>
          <p className="text-lg text-[#4B5563] font-medium leading-relaxed mb-10 max-w-xl">
            InsurAI переосмысляет управление рисками в сельском хозяйстве. Платформа анализирует метеорологические
            данные и использует независимый консенсус Solarium Protocol для вынесения объективных и проверяемых решений
            о страховых выплатах.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/ru/apps/insurai/claims/new"
              className="px-8 py-4 bg-[#059669] text-white text-[13px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#047857] transition-colors shadow-sm"
            >
              Тест Протокола (Localnet)
            </Link>
            <a
              href="#architecture"
              className="px-8 py-4 bg-transparent border border-[#E5E7EB] text-[#111827] text-[13px] font-bold uppercase tracking-widest rounded-lg hover:border-[#D1D5DB] hover:bg-[#F9FAFB] transition-all"
            >
              Изучить Инфраструктуру
            </a>
          </div>
        </div>

        <div className="lg:w-1/2 w-full relative">
          <div className="absolute inset-0 bg-[#059669]/5 blur-[100px] rounded-full z-0" />
          <div className="relative z-10 bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#F3F4F6] p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-6">
              <div>
                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-widest">
                  Анализ метео-условий (№ POL-882)
                </h3>
                <p className="text-xs text-[#6B7280] mt-1 font-mono">15.5007° N, 32.5599° E</p>
              </div>
              <div className="bg-[#111827] text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest">
                Анализ завершен
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F9FAFB] p-5 rounded-xl border border-[#F3F4F6] flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4">
                  Пиковая температура
                </span>
                <span className="text-4xl font-light tracking-tight text-[#111827]">+38.5°C</span>
                <span className="text-xs text-[#059669] font-medium mt-2">Выше порога (30°C)</span>
              </div>
              <div className="bg-[#F9FAFB] p-5 rounded-xl border border-[#F3F4F6] flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4">
                  Сумма осадков
                </span>
                <span className="text-4xl font-light tracking-tight text-[#111827]">0.0 мм</span>
                <span className="text-xs text-[#059669] font-medium mt-2">Ниже порога (10мм)</span>
              </div>
            </div>

            <div className="mt-2 bg-[#F0FDF4] p-5 rounded-xl border border-[#DCFCE7] flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
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
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#166534]">Выплата одобрена сетью Solarium</h4>
                <p className="text-xs text-[#15803D] mt-1 font-medium leading-relaxed">
                  Критерии засухи подтверждены на базе официальных исторических метеоданных. Консенсус смарт-контракта
                  достигнут.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 border-y border-[#E5E7EB]/60">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-[#111827] mb-4">
                Индустрия нуждается в системном обновлении
              </h2>
              <p className="text-[#6B7280] font-medium leading-relaxed">
                Традиционный процесс оценки убытков медленный, субъективный и подвержен искажениям. Это напрямую влияет
                на доходность страховых фондов и финансовую стабильность фермерских хозяйств.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-10 bg-[#F9FAFB] rounded-2xl border border-[#F3F4F6] hover:border-[#E5E7EB] transition-colors">
              <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Проблема 01</div>
              <h3 className="text-xl font-bold text-[#111827] mb-4">Задержки ликвидности</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Выезд комиссий на поля и бюрократическое согласование занимают месяцы. Для агропромышленности заморозка
                оборотного капитала часто означает банкротство до получения выплаты.
              </p>
            </div>
            <div className="p-10 bg-[#F9FAFB] rounded-2xl border border-[#F3F4F6] hover:border-[#E5E7EB] transition-colors">
              <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Проблема 02</div>
              <h3 className="text-xl font-bold text-[#111827] mb-4">Высокие издержки (OPEX)</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Затраты на содержание штата сюрвейеров, юристов и исследователей перекладываются в завышенную стоимость
                страхового полиса, делая его недоступным для малого бизнеса.
              </p>
            </div>
            <div className="p-10 bg-[#F9FAFB] rounded-2xl border border-[#F3F4F6] hover:border-[#E5E7EB] transition-colors">
              <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Проблема 03</div>
              <h3 className="text-xl font-bold text-[#111827] mb-4">Субъективность и Фрод</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Человеческий фактор при оценке ущерба регулярно приводит к мошенническим сговорам на локальном уровне,
                истощая государственные субсидии и фонды.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="py-24 bg-[#111827] text-white border-b border-[#1F2937]">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="mb-20 max-w-3xl">
            <div className="inline-flex items-center px-3 py-1.5 bg-[#1F2937] border border-[#374151] text-[#9CA3AF] text-[11px] font-bold uppercase tracking-widest rounded-full mb-6">
              Инфраструктура платформы
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-6 mt-2">Архитектура доверия</h2>
            <p className="text-[#9CA3AF] font-medium leading-relaxed text-lg">
              InsurAI устраняет человеческий фактор через бесшовную интеграцию официальных API, криптографического
              хранения и сети децентрализованных валидаторов Solarium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12">
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#1F2937] flex items-center justify-center text-white mb-6 border border-[#374151]">
                <svg
                  width="20"
                  height="20"
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
              </div>
              <h4 className="font-bold text-lg mb-3">1. Геолокация и Данные</h4>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">
                Интеграция с официальными метеорологическими институтами (через API) обеспечивает сбор независимых
                данных о температуре и осадках по координатам поля.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#1F2937] flex items-center justify-center text-white mb-6 border border-[#374151]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-3">2. Иммутабельность</h4>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">
                Собранные массивы данных хэшируются и сохраняются в распределенной сети IPFS, что предотвращает любую
                возможность подделки телеметрии задним числом.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#1F2937] flex items-center justify-center text-white mb-6 border border-[#374151]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-3">3. LLM как Судья</h4>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">
                Специализированные ноды (Worker) используют передовые алгоритмы анализа контента для юридически точного
                сопоставления метеоданных с условиями полиса.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#1F2937] flex items-center justify-center text-white mb-6 border border-[#374151]">
                <svg
                  width="20"
                  height="20"
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
              <h4 className="font-bold text-lg mb-3">4. Смарт-Контракт</h4>
              <p className="text-[#9CA3AF] text-sm leading-relaxed">
                В процессе валидации вердикт формируется в сети Solana. Итог закрепляется в блокчейне и становится
                доступен для интеграции в любые другие финансовые системы.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FDFDFD]">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 flex flex-col lg:flex-row gap-20">
          <div className="lg:w-5/12">
            <h2 className="text-3xl font-bold tracking-tight text-[#111827] mb-6">
              Layer-0 Протокол: Инфраструктура для экосистемы
            </h2>
            <p className="text-[#4B5563] font-medium leading-relaxed mb-6">
              InsurAI демонстрирует, как должен применяться <b>Solarium Protocol</b>. Мы не просто создаем интерфейс —
              мы предоставляем фундамент, на котором сторонние команды разработчиков (FinTech, DeFi) могут свободно
              разворачивать свои продукты.
            </p>
            <p className="text-[#4B5563] font-medium leading-relaxed mb-8">
              Благодаря технологии CPI (Cross-Program Invocations), внешний смарт-контракт может программно проверить
              вердикт Solarium-задачи и моментально выплатить средства клиенту из пула ликвидности. Это открывает путь к
              созданию полностью автоматизированных страховых фондов.
            </p>

            <Link
              href="/ru/apps/insurai"
              className="inline-flex items-center gap-2 text-[#059669] font-bold uppercase tracking-widest text-[13px] hover:text-[#047857] transition-colors"
            >
              Перейти к демонстрации
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
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div className="lg:w-7/12">
            <div className="bg-[#111827] rounded-3xl p-8 shadow-2xl border border-[#1F2937] w-full">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#1F2937]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[#9CA3AF] text-xs font-mono">libs.rs / CPI Integration Example</span>
              </div>
              <pre className="font-mono text-[13px] leading-loose overflow-x-auto text-[#E5E7EB]">
                <span className="text-[#A78BFA]">#[instruction(task_id: u64)]</span>
                <span className="text-[#34D399]">pub fn</span> <span className="text-[#60A5FA]">claim_payout</span>(ctx:
                Context&lt;ClaimPayout&gt;) -&gt; <span className="text-[#FCD34D]">Result</span>&lt;()&gt; {"{"}
                <span className="text-[#9CA3AF]">// 1. Интеграция с контрактом Solarium Network</span>
                <span className="text-[#34D399]">let</span> solarium_task = &amp;ctx.accounts.task_account;
                <span className="text-[#9CA3AF]">// 2. Проверка статуса консенсуса</span>
                <span className="text-[#F472B6]">require!</span>(solarium_task.status == TaskStatus::Finalized,
                CustomError::NotFinalized);
                <span className="text-[#9CA3AF]">// 3. Проверка успешности вердикта об ущербе</span>
                <span className="text-[#F472B6]">require!</span>(solarium_task.final_verdict =={" "}
                <span className="text-[#FCA5A5]">1</span>, CustomError::ClaimRejectedByOracle);
                <span className="text-[#9CA3AF]">// 4. Мгновенная выплата USDC без банковских задержек</span>
                token::<span className="text-[#60A5FA]">transfer</span>( ctx.accounts.
                <span className="text-[#60A5FA]">transfer_ctx</span>(),
                <span className="text-[#FCA5A5]">5000_000_000</span>{" "}
                <span className="text-[#9CA3AF]">// 5000 USDC</span>
                )?;
                <span className="text-[#FCD34D]">Ok</span>(())
                {"}"}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#111827] pt-24 pb-12 border-t border-[#1F2937] text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Испытайте платформу в действии</h2>
        <Link
          href="/ru/apps/insurai"
          className="inline-flex px-10 py-5 bg-[#059669] text-white rounded-xl text-[14px] font-bold uppercase tracking-widest hover:bg-[#047857] transition-all mb-16 shadow-lg shadow-[#059669]/20 hover:-translate-y-1"
        >
          Подключить кошелек Phantom
        </Link>
        <div className="flex items-center justify-center gap-2 text-sm text-[#6B7280] font-medium border-t border-[#1F2937] pt-12 max-w-[1400px] mx-auto px-8">
          <span>InsurAI Showcase</span>
          <span>•</span>
          <span>Built on Solarium Protocol</span>
          <span>•</span>
          <span>2026</span>
        </div>
      </footer>
    </div>
  );
}
