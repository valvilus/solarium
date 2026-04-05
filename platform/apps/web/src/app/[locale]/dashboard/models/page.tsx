"use client";

import { useTranslations } from "next-intl";
import { ModelCatalog } from "@/components/dashboard/models/ModelCatalog";

export default function ModelsPage() {
  const t = useTranslations("DashboardModels");

  return (
    <div className="w-full flex-col animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-exo2 font-semibold text-white tracking-tight">{t("title")}</h1>
        <span className="text-[#777] font-onest">{t("description")}</span>
      </div>

      <ModelCatalog />
    </div>
  );
}
