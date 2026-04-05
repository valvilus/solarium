"use client";

import { useTranslations } from "next-intl";
import { EscrowWidget } from "@/components/dashboard/api/EscrowWidget";
import { ApiKeysTable } from "@/components/dashboard/api/ApiKeysTable";

export default function DeveloperApiHub() {
  const t = useTranslations("DashboardApi");

  return (
    <div className="w-full flex-col animate-in fade-in duration-500 relative pb-20">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-exo2 font-semibold text-white tracking-tight">{t("title")}</h1>
        <span className="text-[#777] font-onest">{t("description")}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-1">
          <EscrowWidget />
        </div>
      </div>

      <section>
        <ApiKeysTable />
      </section>
    </div>
  );
}
