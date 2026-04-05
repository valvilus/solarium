"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Browser,
  Cpu,
  ClockClockwise,
  Gear,
  Lifebuoy,
  Desktop,
  Drop,
  Brain,
  MagnifyingGlass,
  TreeStructure,
  BookOpenText,
} from "@phosphor-icons/react";
import { useNetwork } from "@/providers/wallet-provider";

export function DashboardSidebar() {
  const t = useTranslations("DashboardSidebar");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const { network, setNetwork } = useNetwork();

  const primaryNav = [
    { title: t("overview"), href: `/${locale}/dashboard`, icon: Browser, exact: true },
    { title: t("explorer"), href: `/${locale}/explorer`, icon: MagnifyingGlass, exact: false },
    { title: t("operatorNode"), href: `/${locale}/dashboard/node`, icon: Desktop, exact: false },
    { title: t("studyMode"), href: `/${locale}/dashboard/learn`, icon: BookOpenText, exact: false },
    { title: t("polygon"), href: `/${locale}/dashboard/polygon`, icon: TreeStructure, exact: false },
    { title: t("developerApi"), href: `/${locale}/dashboard/api`, icon: Cpu, exact: false },
    { title: t("models"), href: `/${locale}/dashboard/models`, icon: Brain, exact: false },
    { title: t("apps"), href: `/${locale}/dashboard/apps`, icon: Browser, exact: false },
    { title: t("faucet"), href: `/${locale}/dashboard/faucet`, icon: Drop, exact: false },
    { title: t("transactions"), href: `/${locale}/dashboard/history`, icon: ClockClockwise, exact: false },
  ];

  const secondaryNav = [
    { title: t("settings"), href: `/${locale}/dashboard/settings`, icon: Gear },
    { title: t("support"), href: `/${locale}/dashboard/support`, icon: Lifebuoy },
  ];

  const isCurrentRoute = (href: string, exact: boolean) => {
    return exact ? pathname === href : pathname.startsWith(href) && href !== `/${locale}/dashboard`;
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#050505] border-r border-white/5 flex flex-col z-[40]">
      <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 32 32"
            fill="none"
            className="group-hover:-translate-y-0.5 transition-transform duration-300"
          >
            <path d="M16 3 L28 9.5 L16 16 L4 9.5 Z" fill="#FFFFFF" fillOpacity="0.15" />
            <path d="M4 10.5 L15.5 16.8 V29 L4 22.5 Z" fill="#FFFFFF" fillOpacity="0.5" />
            <path d="M28 10.5 L16.5 16.8 V29 L28 22.5 Z" fill="#FFFFFF" />
          </svg>
          <span className="font-unbounded font-medium tracking-[0.2em] uppercase text-white/90 text-[12px] mt-[1px]">
            Solarium
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6 flex flex-col gap-1">
        {primaryNav.map((item) => {
          const active = isCurrentRoute(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                active ? "bg-white/10 text-white" : "text-[#777] hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon
                weight={active ? "fill" : "regular"}
                className={`w-[18px] h-[18px] transition-colors ${active ? "text-white" : "text-[#555] group-hover:text-white"}`}
              />
              <span className="font-onest text-[14px] font-medium">{item.title}</span>
            </Link>
          );
        })}

        <div className="h-px bg-white/5 my-4 mx-2" />

        {secondaryNav.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#777] hover:text-white hover:bg-white/5 transition-colors group"
          >
            <item.icon
              weight="regular"
              className="w-[18px] h-[18px] text-[#555] group-hover:text-white transition-colors"
            />
            <span className="font-onest text-[14px] font-medium">{item.title}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-[#080808]">
        <div className="mb-2 px-2 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#555]">{t("networkTitle")}</span>
          <div className={`w-1.5 h-1.5 rounded-full ${network === "localnet" ? "bg-[#10D9B0]" : "bg-[#4895EF]"}`} />
        </div>
        <div className="flex bg-[#0A0A0A] border border-white/5 rounded-md p-1">
          <button
            onClick={() => setNetwork("localnet")}
            className={`flex-1 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider transition-all ${
              network === "localnet" ? "bg-white/10 text-white shadow-sm" : "text-[#555] hover:text-[#888]"
            }`}
          >
            {t("localnet")}
          </button>
          <button
            onClick={() => setNetwork("devnet")}
            className={`flex-1 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider transition-all ${
              network === "devnet" ? "bg-white/10 text-white shadow-sm" : "text-[#555] hover:text-[#888]"
            }`}
          >
            {t("devnet")}
          </button>
        </div>
      </div>
    </aside>
  );
}
