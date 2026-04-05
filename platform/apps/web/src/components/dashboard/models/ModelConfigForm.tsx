"use client";

import { useTranslations } from "next-intl";
import { Keyhole, Eye, EyeSlash, CheckCircle, Trash } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function ModelConfigForm() {
  const t = useTranslations("DashboardModels");

  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("solarium_gemini_key");
    if (storedKey) {
      setApiKey(storedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      return;
    }
    localStorage.setItem("solarium_gemini_key", apiKey.trim());
    setIsSaved(true);
    toast.success(t("keySaved"));
  };

  const handleWipe = () => {
    localStorage.removeItem("solarium_gemini_key");
    setApiKey("");
    setIsSaved(false);
    toast.error(t("keyRemoved"));
  };

  return (
    <div className="flex flex-col gap-6 mt-8 p-6 bg-[#050505] border border-white/5 rounded-xl block">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-[10px] uppercase tracking-widest text-[#777] flex items-center gap-2">
          <Keyhole weight="bold" /> {t("apiKey")}
        </label>

        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                if (isSaved) setIsSaved(false);
              }}
              placeholder={t("apiKeyPlaceholder")}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#10D9B0]/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
            >
              {showKey ? <EyeSlash weight="fill" className="size-5" /> : <Eye weight="fill" className="size-5" />}
            </button>
          </div>

          {!isSaved ? (
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="px-6 py-3 bg-[#10D9B0] text-black font-semibold font-onest rounded-lg flex items-center gap-2 hover:bg-[#10D9B0]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <CheckCircle weight="bold" className="size-5" />
              {t("saveKey")}
            </button>
          ) : (
            <button
              onClick={handleWipe}
              className="px-6 py-3 bg-[#FF1515]/10 text-[#FF1515] border border-[#FF1515]/20 font-semibold font-onest rounded-lg flex items-center gap-2 hover:bg-[#FF1515] hover:text-white transition-colors whitespace-nowrap"
            >
              <Trash weight="bold" className="size-5" />
              {t("removeKey")}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-[#10D9B0]/5 border border-[#10D9B0]/10 rounded-md">
        <span className="w-2 h-2 rounded-full bg-[#10D9B0] shadow-[0_0_8px_#10D9B0]" />
        <p className="font-onest text-xs text-[#10D9B0]/80">{t("storedLocally")}</p>
      </div>
    </div>
  );
}
