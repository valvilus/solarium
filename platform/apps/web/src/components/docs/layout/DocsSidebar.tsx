"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { BookOpen, RocketLaunch, Cpu, Code, HardDrives, FileCode, Robot, ShieldCheck } from "@phosphor-icons/react";

const navGroups = [
  {
    labelKey: "groupOverview",
    links: [
      { href: "/docs", i18nKey: "intro", icon: BookOpen },
      { href: "/docs/architecture", i18nKey: "architecture", icon: Cpu },
    ],
  },
  {
    labelKey: "groupDevs",
    links: [
      { href: "/docs/quickstart", i18nKey: "quickstart", icon: RocketLaunch },
      { href: "/docs/smart-contracts", i18nKey: "smartContracts", icon: FileCode },
      { href: "/docs/sdk", i18nKey: "sdk", icon: Code },
      { href: "/docs/models", i18nKey: "models", icon: Robot },
    ],
  },
  {
    labelKey: "groupNodes",
    links: [
      { href: "/docs/nodes", i18nKey: "nodeOverview", icon: HardDrives },
      { href: "/docs/nodes/worker", i18nKey: "workerGuide", icon: Robot },
      { href: "/docs/nodes/validator", i18nKey: "validatorGuide", icon: ShieldCheck },
    ],
  },
];

export function DocsSidebar() {
  const t = useTranslations("DocsSidebar");
  const pathname = usePathname();

  const locale = pathname.split("/")[1] || "en";

  return (
    <aside className="w-[280px] shrink-0 border-r border-[#111] bg-[#050505] h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto hidden lg:flex flex-col">
      <div className="py-8 px-6 flex flex-col gap-8">
        {navGroups.map((group, i) => (
          <div key={i} className="flex flex-col gap-3">
            <h4 className="font-unbounded text-[#555] text-[10px] tracking-widest uppercase mb-1 px-4">
              {t(group.labelKey)}
            </h4>
            <nav className="flex flex-col gap-1">
              {group.links.map((link) => {
                const targetPath = `/${locale}${link.href}`;
                const isActive = link.href === "/docs" ? pathname === targetPath : pathname.startsWith(targetPath);

                return (
                  <Link
                    key={link.href}
                    href={targetPath}
                    className={`flex flex-row items-center gap-3 px-4 py-2.5 rounded-md transition-colors duration-300 font-onest text-[14.5px] ${
                      isActive ? "bg-white/5 text-white" : "text-[#777] hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    <link.icon
                      weight={isActive ? "fill" : "regular"}
                      className={`size-[18px] transition-colors ${isActive ? "text-[#8BA3C0]" : "text-[#555]"}`}
                    />
                    <span className="font-medium">{t(link.i18nKey)}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
