"use client";

import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";

export default function ResiDaoLanding({ params: { locale } }: { params: { locale: string } }): JSX.Element {
  const isRu = locale === "ru";

  const t = {
    navBrand: "ResiDAO",
    navPowered: isRu ? "OS ПРОШИВКА ЖИЛОГО КОМПЛЕКСА" : "RESIDENTIAL OS FIRMWARE",
    launchBtn: isRu ? "Войти в DApp" : "Launch DApp",

    heroSuper: isRu ? "Экосистема Solarium" : "Solarium Ecosystem",
    heroTitle: isRu
      ? "Операционная система для ЖКХ нового поколения"
      : "The Next-Gen Operating System for Property Management",
    heroDesc: isRu
      ? "ResiDAO — это полностью децентрализованный интерфейс управления коммерческой и жилой недвижимостью (ОСИ). Прототип демонстрирует, как ИИ-секретари на базе Solarium Protocol могут автономно модерировать бюджеты жилых комплексов, защищая их от коррупции и нецелевых трат."
      : "ResiDAO is a fully decentralized property management interface (HOA). The prototype demonstrates how AI-secretaries powered by the Solarium Protocol can autonomously moderate residential budgets, protecting them from corruption and misuse of funds.",

    stat1Val: "$3.8T",
    stat1Label: isRu ? "Объем Рынка ЖКХ" : "TAM (Property Mgmt)",
    stat2Val: "0%",
    stat2Label: isRu ? "Толерантность к откатам" : "Kickback Tolerance",

    box1Label: isRu ? "Проблема" : "The Problem",
    box1Title: isRu ? "Утечка Бюджетов" : "Budget Leakage",
    box1Desc: isRu
      ? "Каждый месяц жильцы сдают взносы. Председатели ОСИ нанимают подрядчиков по завышенным сметам, получая откаты. Классические CRM системы никак не защищают деньги, они лишь делают этот обман цифровым."
      : "Every month, residents pay fees. HOA chairmen hire contractors with inflated estimates, receiving kickbacks. Classic CRM systems do not protect the money; they merely digitize the deception.",

    box2Label: isRu ? "Решение" : "The Solution",
    box2Title: isRu ? "On-Chain Консенсус" : "On-Chain Consensus",
    box2Desc: isRu
      ? "Кассовые разрывы в прошлом. Бюджет дома хранится в защищенном смарт-контракте Solana. Любая счет-фактура сканируется сетью Solarium, сверяется с рынком и оплачивается только при совпадении цен."
      : "Cash gaps are in the past. The building's budget is stored in a secure Solana smart contract. Every invoice is scanned by the Solarium network, compared to the market, and paid only if prices match.",

    demoSuper: isRu ? "Архитектура интеграции" : "Integration Architecture",
    demoTitle: isRu ? "Код вместо доверия. Никаких взяток." : "Code Instead of Trust. Zero Bribes.",
    demoCodeHeader: isRu ? "Умная проверка платежей" : "Smart Payment Verification",

    ctaTitle: isRu ? "Оцифруйте свой жилой комплекс" : "Digitize your residential complex",
    ctaDesc: isRu
      ? "Прототип полностью функционален. Подключите кошелек и испытайте децентрализованное управление бюджетом."
      : "The prototype is fully functional. Connect your wallet and experience decentralized budget management.",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-onest selection:bg-[#10B981]/20 pb-24">
      <nav className="relative z-50 flex items-center justify-between px-8 lg:px-16 py-8">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-white shadow-lg shadow-[#10B981]/20">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold text-[#0F172A] tracking-tight">{t.navBrand}</span>
            <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-[#64748B] bg-white border border-[#E2E8F0] px-2 py-1 rounded-full hidden sm:inline-block">
              {t.navPowered}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href={`/${locale}`}
            className="hidden md:block text-[11px] font-bold uppercase tracking-widest text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            Solarium Protocol
          </Link>
          <Link
            href={`/${locale}/apps/residao`}
            className="px-6 py-3 bg-[#10B981] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#10B981]/20"
          >
            {t.launchBtn}
          </Link>
        </div>
      </nav>

      <main className="px-6 lg:px-12 max-w-[1400px] mx-auto mt-6 flex flex-col gap-6">
        <div className="bg-white rounded-[40px] p-8 lg:p-16 border border-[#E2E8F0] shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10B981]/5 blur-[80px] rounded-bl-full pointer-events-none" />

          <div className="lg:w-3/5 relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-[#10B981] bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-1.5 rounded-lg w-fit">
                {t.heroSuper}
              </h2>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-[#0F172A] mb-8 leading-[1.1] max-w-2xl">
              {t.heroTitle}
            </h1>
            <p className="text-[17px] font-medium text-[#64748B] leading-relaxed max-w-xl mb-10">{t.heroDesc}</p>

            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/apps/residao`}
                className="inline-flex items-center justify-center bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-[20px] py-4 px-8 font-bold text-[13px] uppercase tracking-widest transition-all shadow-md transform hover:-translate-y-0.5"
              >
                {t.launchBtn}
              </Link>
              <a
                href="#architecture"
                className="inline-flex items-center justify-center bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#0F172A] rounded-[20px] py-4 px-8 font-bold text-[13px] uppercase tracking-widest transition-all"
              >
                Архитектура
              </a>
            </div>
          </div>

          <div className="lg:w-2/5 flex flex-col gap-4 relative z-10 w-full">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-[24px] flex flex-col items-center justify-center">
              <div className="text-6xl font-black font-mono tracking-tighter text-[#0F172A] mb-2">{t.stat1Val}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] text-center">
                {t.stat1Label}
              </div>
            </div>
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-8 rounded-[24px] flex flex-col items-center justify-center shadow-sm">
              <div className="text-6xl font-black font-mono tracking-tighter text-[#10B981] mb-2">{t.stat2Val}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#059669] text-center">
                {t.stat2Label}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[40px] p-10 border border-[#E2E8F0] shadow-sm flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF1F2] flex items-center justify-center border border-[#FECDD3]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#E11D48"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E11D48] bg-[#FFF1F2] px-3 py-1.5 rounded-lg border border-[#FECDD3]">
                  {t.box1Label}
                </span>
              </div>
              <h3 className="text-3xl font-black tracking-tight text-[#0F172A] mb-4">{t.box1Title}</h3>
              <p className="text-[15px] font-medium text-[#64748B] leading-relaxed max-w-sm">{t.box1Desc}</p>
            </div>

            <div className="mt-12 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[24px] p-6 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-sm">Смета: Ремонт крыши</span>
                <span className="font-mono font-black text-[#E11D48]">-$25,000</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                <span>Статус:</span>
                <span className="text-[#0F172A]">Одобрено Председателем (Без проверки)</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] rounded-[40px] p-10 border border-[#1E293B] shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#10B981]/20 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-[#064E3B] flex items-center justify-center border border-[#047857]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#10B981] bg-[#064E3B] px-3 py-1.5 rounded-lg border border-[#047857]">
                  {t.box2Label}
                </span>
              </div>
              <h3 className="text-3xl font-black tracking-tight text-white mb-4">{t.box2Title}</h3>
              <p className="text-[15px] font-medium text-[#94A3B8] leading-relaxed max-w-sm">{t.box2Desc}</p>
            </div>

            <div className="mt-12 bg-[#1E293B] border border-[#334155] rounded-[24px] p-6 relative z-10">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-sm text-white">Solarium Scanner</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981] bg-[#064E3B] border border-[#047857] px-2 py-1 rounded-md">
                  CPI Active
                </span>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-[#334155] rounded-full overflow-hidden">
                  <div className="h-full bg-[#10B981] w-[100%]" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">
                  Рыночная наценка: +112% (Заблокировано)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          id="architecture"
          className="bg-white rounded-[40px] p-10 lg:p-16 border border-[#E2E8F0] shadow-sm flex flex-col items-center text-center"
        >
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg mb-6">
            {t.demoSuper}
          </span>
          <h3 className="text-3xl lg:text-4xl font-black tracking-tight text-[#0F172A] mb-12 max-w-xl">
            {t.demoTitle}
          </h3>

          <div className="w-full lg:w-3/4 text-left bg-[#0F172A] rounded-[32px] p-8 shadow-2xl relative border border-[#1E293B]">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#1E293B]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#334155]" />
                <div className="w-3 h-3 rounded-full bg-[#334155]" />
                <div className="w-3 h-3 rounded-full bg-[#334155]" />
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#64748B]">
                {t.demoCodeHeader}
              </span>
            </div>

            <pre className="font-mono text-sm leading-[2] text-[#F8FAFC] overflow-x-auto">
              <span className="text-[#94A3B8]">#[instruction(task_id: u64)]</span>
              <span className="text-[#10B981] font-bold">pub fn</span> verify_contractor_invoice(ctx:
              Context&lt;VerifyInvoice&gt;) -&gt; Result&lt;()&gt; {"{"}
              <span className="text-[#64748B] italic">// 1. Retrieve Solarium Oracle Consensus via CPI</span>
              <span className="text-[#38BDF8] font-bold">let</span> oracle_response = &amp;ctx.accounts.solarium_task;
              <span className="text-[#64748B] italic">
                // 2. Validate Market Pricing Margin (No more than 15% markup allowed)
              </span>
              <span className="text-[#38BDF8] font-bold">require!</span>( oracle_response.markup_percentage &lt;{" "}
              <span className="text-[#F59E0B]">15</span>, ResiDaoError::MarkupTooHigh );
              <span className="text-[#64748B] italic">// 3. Auto-Release Funds from DAO Treasury</span>
              token::transfer( ctx.accounts.vault_auth(), oracle_response.requested_amount )?;
              <span className="text-[#38BDF8] font-bold">Ok</span>(())
              {"}"}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-16 border border-[#E2E8F0] shadow-sm flex flex-col justify-center items-center text-center mt-6">
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-[#0F172A] mb-6">{t.ctaTitle}</h2>
          <p className="text-[17px] font-medium text-[#64748B] max-w-xl mb-10">{t.ctaDesc}</p>

          <Link
            href={`/${locale}/apps/residao`}
            className="inline-flex items-center gap-3 bg-[#10B981] hover:bg-[#059669] text-white px-8 py-5 rounded-[20px] font-bold text-[13px] uppercase tracking-widest transition-all shadow-lg shadow-[#10B981]/20 transform hover:-translate-y-1"
          >
            {t.launchBtn}
            <ArrowUpRight weight="bold" />
          </Link>
        </div>
      </main>
    </div>
  );
}
