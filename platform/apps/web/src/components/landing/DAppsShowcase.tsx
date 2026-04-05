"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Stack, Hammer, ArrowUpRight, Buildings, CloudRain, Graph } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DAppsShowcase() {
  const t = useTranslations("DAppsShowcase");
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const hasCompletedRef = useRef(false);
  const isLockedRef = useRef(false);
  const accumRef = useRef(0);

  const COLOR_RESIDAO = "#8BA3C0";
  const COLOR_INSURA = "#43C79D";
  const COLOR_SENTINEL = "#F1B959";
  const COLOR_CRIMSON = "#E64C4C";

  useEffect(() => {
    const main = document.querySelector("main") || window;
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent | TouchEvent) => {
      if (hasCompletedRef.current) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const rectCenter = rect.top + rect.height / 2;
      const windowCenter = windowHeight / 2;

      const distanceToCenter = rectCenter - windowCenter;

      const isCentered = Math.abs(distanceToCenter) < 150;

      let deltaY = 0;
      if (e instanceof WheelEvent) {
        deltaY = e.deltaY;
      } else if (e instanceof TouchEvent) {
      }

      if (!isLockedRef.current && isCentered && deltaY > 0) {
        isLockedRef.current = true;

        const scrollParent = container.closest(".overflow-y-auto") || window;
        if (scrollParent !== window && "scrollTo" in scrollParent) {
          const currentScroll = (scrollParent as HTMLElement).scrollTop;
          (scrollParent as Element).scrollTo({
            top: currentScroll + distanceToCenter,
            behavior: "smooth",
          });
        } else {
          window.scrollTo({
            top: window.scrollY + distanceToCenter,
            behavior: "smooth",
          });
        }
      }

      if (isLockedRef.current) {
        if (e.cancelable) e.preventDefault();

        accumRef.current += deltaY;

        if (accumRef.current < 0) {
          accumRef.current = 0;
          isLockedRef.current = false;
          return;
        }

        if (accumRef.current < 400) setActiveTab(0);
        else if (accumRef.current < 800) setActiveTab(1);
        else if (accumRef.current < 1200) setActiveTab(2);
        else {
          hasCompletedRef.current = true;
          isLockedRef.current = false;
        }
      }
    };

    main.addEventListener("wheel", handleWheel as any, { passive: false });
    main.addEventListener("touchmove", handleWheel as any, { passive: false });

    return () => {
      main.removeEventListener("wheel", handleWheel as any);
      main.removeEventListener("touchmove", handleWheel as any);
    };
  }, []);

  const apps = [
    {
      id: "residao",
      tab: t("tab1"),
      status: true,
      icon: Buildings,
      title: t("app1Title"),
      desc: t("app1Desc"),
      accent: COLOR_RESIDAO,
      link: `/${locale}/residao`,
      uiPreview: (
        <div className="flex flex-col gap-3 font-mono text-[11px] h-full w-full p-6 overflow-hidden">
          <div className="flex justify-between text-white/50 border-b border-white/5 pb-2 uppercase tracking-widest">
            <span>Target_Contract</span>
            <span>ResiDAO_Treasury</span>
          </div>
          <div
            className="rounded-xl p-4 mt-2 border"
            style={{ backgroundColor: `${COLOR_RESIDAO}0A`, borderColor: `${COLOR_RESIDAO}1A` }}
          >
            <div className="mb-2 uppercase tracking-widest" style={{ color: COLOR_RESIDAO }}>
              Analysis Result
            </div>
            <div className="flex justify-between items-center text-white mb-1">
              <span>Estimate:</span>
              <span style={{ color: COLOR_RESIDAO }}>$124k</span>
            </div>
            <div className="flex justify-between items-center text-white/70">
              <span>Market Std:</span>
              <span>$85k</span>
            </div>
          </div>
          <div
            className="rounded-md p-3 mt-auto shrink-0 flex items-center justify-center gap-3 w-full border"
            style={{ backgroundColor: `${COLOR_CRIMSON}0A`, borderColor: `${COLOR_CRIMSON}1A` }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR_CRIMSON }} />
            <span
              className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold"
              style={{ color: COLOR_CRIMSON }}
            >
              ACTION: BLOCK
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "insurai",
      tab: t("tab2"),
      status: true,
      icon: CloudRain,
      title: t("app2Title"),
      desc: t("app2Desc"),
      accent: COLOR_INSURA,
      link: `/${locale}/insurai`,
      uiPreview: (
        <div className="flex flex-col gap-3 font-mono text-[11px] h-full w-full p-6 overflow-hidden">
          <div className="flex justify-between text-white/50 border-b border-white/5 pb-2 uppercase tracking-widest">
            <span>Data_Source</span>
            <span>NOAA_Meteo_API</span>
          </div>
          <div
            className="rounded-xl p-4 mt-2 border"
            style={{ backgroundColor: `${COLOR_INSURA}0A`, borderColor: `${COLOR_INSURA}1A` }}
          >
            <div className="mb-2 uppercase tracking-widest" style={{ color: COLOR_INSURA }}>
              Weather Verification
            </div>
            <div className="flex justify-between items-center text-white mb-1">
              <span>Precipitation (30d):</span>
              <span style={{ color: COLOR_INSURA }}>12mm (CRIT)</span>
            </div>
            <div className="flex justify-between items-center text-white/70">
              <span>Region:</span>
              <span>Central Valley, CA</span>
            </div>
          </div>
          <div
            className="rounded-md p-3 mt-auto shrink-0 flex items-center justify-center gap-3 w-full border"
            style={{ backgroundColor: `${COLOR_INSURA}0A`, borderColor: `${COLOR_INSURA}2A` }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR_INSURA }} />
            <span
              className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold"
              style={{ color: COLOR_INSURA }}
            >
              PAYOUT EXECUTED
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "defisentinel",
      tab: t("tab3"),
      status: false,
      icon: Graph,
      title: t("app3Title"),
      desc: t("app3Desc"),
      accent: COLOR_SENTINEL,
      link: "#",
      uiPreview: (
        <div className="flex flex-col gap-3 font-mono text-[11px] h-full w-full p-6 opacity-60">
          <div className="absolute inset-0 z-20 flex justify-center flex-col items-center backdrop-blur-md bg-black/40 rounded-3xl">
            <Hammer className="w-8 h-8 mb-4" style={{ color: COLOR_SENTINEL }} weight="fill" />
            <div className="font-bold uppercase tracking-widest text-sm" style={{ color: COLOR_SENTINEL }}>
              Under Construction
            </div>
            <div className="text-white/50 mt-2 max-w-[200px] text-center leading-relaxed">
              Protocol in testing phase on Devnet
            </div>
          </div>
          <div className="flex justify-between text-white/50 border-b border-white/5 pb-2 uppercase tracking-widest">
            <span>Monitored_Pool</span>
            <span>Aave_Whale_Wallet</span>
          </div>
          <div
            className="rounded-xl p-4 mt-2 border"
            style={{ backgroundColor: `${COLOR_SENTINEL}0A`, borderColor: `${COLOR_SENTINEL}1A` }}
          >
            <div className="mb-2 uppercase tracking-widest" style={{ color: COLOR_SENTINEL }}>
              Sentiment Analysis
            </div>
            <div className="flex justify-between items-center text-white mb-1">
              <span>Risk Factor:</span>
              <span style={{ color: COLOR_CRIMSON }}>85% (HIGH)</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const activeData = apps[activeTab];

  const handleTabClick = (idx: number) => {
    hasCompletedRef.current = true;
    isLockedRef.current = false;
    setActiveTab(idx);
  };

  return (
    <section
      ref={containerRef}
      id="applications"
      className="relative w-full bg-[#050505] font-sans border-t border-white/5 py-24 lg:py-40"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_10%,transparent_100%)] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 lg:mb-16">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full w-fit bg-white/[0.03] border border-white/[0.08]">
              <Stack weight="fill" className="w-4 h-4 text-[#A3A3A3]" />
              <span className="font-onest text-[11px] font-semibold uppercase tracking-widest text-[#A3A3A3]">
                {t("badge")}
              </span>
            </div>

            <h2 className="font-exo2 text-4xl lg:text-5xl font-bold text-white tracking-wide uppercase">
              {t("title1")} <br className="hidden md:block" />
              <span className="text-white/40">{t("title2")}</span>
            </h2>
          </div>

          <div className="md:w-1/3">
            <p className="font-onest text-[15px] sm:text-base text-[#888888] leading-relaxed relative pl-4 border-l-2 border-white/10">
              {t("description")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[450px]">
          <div className="lg:col-span-4 flex flex-col gap-4">
            {apps.map((app, idx) => (
              <button
                key={app.id}
                onClick={() => handleTabClick(idx)}
                className={`relative group w-full flex items-center justify-between p-5 lg:p-6 rounded-3xl border transition-all duration-300 text-left overflow-hidden ${activeTab === idx ? "bg-white/[0.05] border-white/20" : "bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/10"}`}
              >
                {activeTab === idx && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)] z-10 rounded-r-md"
                  />
                )}

                <div className="flex items-center gap-4 relative z-10 ml-2">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${activeTab === idx ? "bg-white/10 text-white" : "bg-[#060606] border border-white/[0.04] text-[#777] group-hover:text-white group-hover:bg-[#0A0A0A]"}`}
                  >
                    <app.icon weight="fill" className="w-5 h-5" />
                  </div>
                  <div>
                    <div
                      className={`font-exo2 font-bold text-lg lg:text-xl transition-colors ${activeTab === idx ? "text-white" : "text-[#888888] group-hover:text-white"}`}
                    >
                      {app.tab}
                    </div>
                  </div>
                </div>

                <div
                  className="px-2 py-1 rounded border text-[9px] font-bold tracking-widest relative z-10 shrink-0"
                  style={{
                    backgroundColor: `${app.accent}1A`,
                    color: app.accent,
                    borderColor: `${app.accent}33`,
                  }}
                >
                  {app.status ? t("statusActive") : t("statusDev")}
                </div>
              </button>
            ))}

            <div className="hidden lg:block mt-auto pt-6">
              <a
                href="https://docs.solarium.dev"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors w-fit"
              >
                <span className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                  <ArrowUpRight weight="bold" className="w-4 h-4" />
                </span>
                <span className="font-onest font-medium uppercase tracking-widest text-xs">Deploy your DApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 flex relative min-h-[450px]">
            {apps.map((item, idx) => (
              <div
                key={item.id}
                className={`absolute inset-0 w-full h-full flex flex-col md:flex-row bg-[#080808] rounded-[2rem] border border-white/[0.06] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] transition-all duration-700
                       ${activeTab === idx ? "opacity-100 z-10 translate-x-0 scale-100" : "opacity-0 z-0 -translate-x-8 scale-95 pointer-events-none"}`}
              >
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen transition-colors duration-1000"
                  style={{ background: `radial-gradient(circle at 70% 30%, ${item.accent}, transparent 60%)` }}
                />

                <div className="w-full md:w-[55%] p-8 lg:p-12 flex flex-col justify-center z-10 border-b md:border-b-0 md:border-r border-white/5 bg-[#050505]/40 backdrop-blur-xl">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shrink-0"
                    style={{
                      backgroundColor: `${item.accent}0A`,
                      color: item.accent,
                      border: `1px solid ${item.accent}15`,
                    }}
                  >
                    <item.icon weight="fill" className="w-6 h-6" />
                  </div>
                  <h3 className="font-exo2 text-2xl lg:text-3xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="font-onest text-[#A3A3A3] text-[15px] sm:text-[16px] leading-relaxed mb-8">
                    {item.desc}
                  </p>

                  <div className="mt-8 relative group/tooltip w-fit">
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none z-20 flex flex-col items-center">
                      <div className="bg-white text-black font-bold text-[10px] uppercase tracking-widest px-3 py-2 rounded-lg whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                        Test Live Prototype
                      </div>
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white mt-[-1px]" />
                    </div>

                    {item.status ? (
                      <Link
                        href={item.link}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-onest font-semibold text-[13px] uppercase tracking-wider hover:scale-[1.03] transition-transform duration-300 relative z-10 shadow-[0_10px_20px_-10px_rgba(255,255,255,0.3)]"
                      >
                        Launch App <ArrowUpRight weight="bold" className="w-4 h-4" />
                      </Link>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-white/40 border border-white/10 font-onest font-semibold text-[13px] uppercase tracking-wider cursor-not-allowed">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-[45%] bg-[#050505] relative z-10 flex flex-col items-center justify-center p-6">
                  <div className="w-full h-full min-h-[300px] flex flex-col bg-[#0A0A0A] rounded-3xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,1)] overflow-hidden relative">
                    <div className="h-8 border-b border-white/5 flex items-center px-4 gap-1.5 bg-white/[0.02] shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                      <div className="mx-auto text-[9px] font-mono text-white/30 tracking-widest">
                        {item.id}.solarium.agent
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">{item.uiPreview}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
