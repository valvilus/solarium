"use client";

import { useTranslations } from "next-intl";
import { APP_REGISTRY } from "@/lib/app-registry";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Desktop, Buildings, CloudRain, Graph, Bug } from "@phosphor-icons/react";

export default function DashboardAppsPage() {
  const t = useTranslations("DashboardApps");
  const tApps = useTranslations("Apps");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const getIcon = (slug: string) => {
    switch (slug) {
      case "residao":
        return <Buildings weight="fill" className="size-8" />;
      case "insurai":
        return <CloudRain weight="fill" className="size-8" />;
      case "defisentinel":
        return <Graph weight="fill" className="size-8" />;
      case "bugbounty":
        return <Bug weight="fill" className="size-8" />;
      default:
        return <Desktop weight="fill" className="size-8" />;
    }
  };

  return (
    <div className="w-full flex-col animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2 mb-8 border-b border-white/5 pb-8">
        <h1 className="text-3xl font-exo2 font-semibold text-white tracking-tight">{t("title")}</h1>
        <span className="text-[#777] font-onest">{t("description")}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {APP_REGISTRY.map((app) => (
          <div
            key={app.slug}
            className="group flex flex-col bg-[#0A0A0A] border border-white/5 rounded-[32px] overflow-hidden hover:border-white/10 transition-colors w-full relative"
          >
            <div className="h-1.5 w-full shrink-0" style={{ backgroundImage: app.bgGradient }} />

            <div className="p-8 flex flex-col h-full relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border border-white/[0.05]"
                  style={{ backgroundColor: `rgba(${app.accentRgb}, 0.1)`, color: app.accentColor }}
                >
                  {getIcon(app.slug)}
                </div>

                <div
                  className="px-2.5 py-1 rounded-[6px] border text-[9px] font-bold uppercase tracking-widest"
                  style={{
                    backgroundColor: `rgba(${app.accentRgb}, 0.1)`,
                    borderColor: `rgba(${app.accentRgb}, 0.2)`,
                    color: app.accentColor,
                  }}
                >
                  {app.status === "live" ? t("statusLive") : t("statusBeta")}
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-2xl font-exo2 font-bold text-white tracking-tight">{tApps(`${app.slug}.name`)}</h2>
                <p className="text-[#777] text-sm font-onest leading-relaxed mb-4">
                  {tApps(`${app.slug}.description`)}
                </p>
              </div>

              <div className="pt-6 mt-2 border-t border-white/5 flex items-center justify-between">
                <div className="text-[10px] text-[#555] font-mono uppercase tracking-widest">
                  {tApps(`${app.slug}.category`)}
                </div>

                {app.status === "live" ? (
                  <Link
                    href={`/${locale}/${["defisentinel", "bugbounty", "insurai", "residao"].includes(app.slug) ? "" : "apps/"}${app.slug}`}
                    className="inline-flex items-center justify-center bg-white text-black font-onest font-semibold px-4 py-2 rounded-lg text-xs gap-2 group-hover:scale-[1.02] transition-transform shadow-md hover:bg-white/90"
                  >
                    {t("launch")} <ArrowUpRight weight="bold" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center justify-center bg-white/5 text-white/30 border border-white/10 font-onest font-semibold px-4 py-2 rounded-lg text-xs cursor-not-allowed"
                  >
                    {t("statusBeta")}
                  </button>
                )}
              </div>
            </div>

            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none blur-3xl z-0"
              style={{ backgroundColor: app.accentColor }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
