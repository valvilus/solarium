"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useResiDao } from "@/providers/ResiDaoProvider";

const RESIDENT_NAV = [
  {
    href: "",
    label: "Дашборд ЖК",
    icon: (
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
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    href: "/finance",
    label: "Казначейство",
    icon: (
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
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: "/dao",
    label: "Голосования AI",
    icon: (
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
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    href: "/community",
    label: "Реестр Жителей",
    icon: (
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
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const CONTRACTOR_NAV = [
  {
    href: "",
    label: "Мои Сметы",
    icon: (
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
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    href: "/new",
    label: "Сдать Акт",
    icon: (
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
    ),
  },
];

export function ResiDaoSidebar(): JSX.Element {
  const { role } = useResiDao();
  const locale = useLocale();
  const pathname = usePathname();

  const baseUrl = `/${locale}/apps/residao`;
  const navItems = role === "resident" || role === "chairman" ? RESIDENT_NAV : CONTRACTOR_NAV;

  return (
    <div className="w-[280px] bg-white border-r border-[#E2E8F0] h-full flex-col hidden md:flex shrink-0 shadow-sm z-20 relative text-[#0F172A]">
      <div className="h-20 flex items-center px-6 border-b border-[#E2E8F0] bg-white/80">
        <Link href={`/${locale}/apps`} className="flex items-center gap-3 transition-opacity hover:opacity-80 group">
          <div className="w-8 h-8 rounded-lg bg-resi-accent flex items-center justify-center shadow-lg shadow-resi-accent/20 group-hover:scale-105 transition-transform text-white">
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
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-[15px] leading-none text-[#0F172A]">ResiDAO</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#64748B] mt-0.5">
              Operating System
            </span>
          </div>
        </Link>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-10 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm relative">
            <div
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${role === "contractor" ? "bg-amber-500" : "bg-emerald-500"}`}
            />
            {role === "contractor" ? (
              <span className="text-amber-500 font-black text-[13px] tracking-tighter">B2B</span>
            ) : (
              <span className="text-emerald-500 font-black text-[13px] tracking-tighter">ЖК</span>
            )}
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#0F172A] mb-0.5">
              {role === "contractor" ? "B2B Кабинет Подрядчика" : "ЖК Sunrise"}
            </div>
            <div
              className={`text-[10px] uppercase font-bold tracking-widest ${role === "contractor" ? "text-amber-500" : "text-emerald-500"}`}
            >
              {role === "contractor" ? "Enterprise Mode" : "Resident Mode"}
            </div>
          </div>
        </div>

        <div className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-4 px-2">Главное меню</div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const path = `${baseUrl}${item.href}`;
            const isActive = pathname === path || (item.href !== "" && pathname.startsWith(path));

            return (
              <Link
                key={item.href}
                href={path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold text-[13px] group relative overflow-hidden ${
                  isActive
                    ? "text-[#0F172A] bg-resi-accent/10 border border-resi-accent/20"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent"
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-resi-accent" />}
                <div
                  className={`${isActive ? "text-resi-accent" : "text-[#64748B] group-hover:text-resi-accent"} transition-colors`}
                >
                  {item.icon}
                </div>
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-resi-accent animate-pulse" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Protocol Secured by</span>
          <div className="flex items-center gap-2 mt-1">
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
            <span className="text-[11px] text-[#0F172A] uppercase font-black tracking-wider">Solarium Network</span>
          </div>
        </div>
      </div>
    </div>
  );
}
