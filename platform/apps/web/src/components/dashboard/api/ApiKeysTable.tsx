"use client";

import { useState } from "react";
import { Key, Copy, Plus, Eye, EyeSlash, CheckCircle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

export function ApiKeysTable() {
  const t = useTranslations("DashboardApi");
  const [apiKeys, setApiKeys] = useState<{ id: string; key: string; created: string }[]>([
    { id: "1", key: "slrm_live_x8F2nH9KqLzA", created: "2026-04-01" },
    { id: "2", key: "slrm_test_m3D1vJ6TxPzY", created: "2026-03-15" },
  ]);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerateKey = () => {
    const prefix = Math.random() > 0.5 ? "slrm_live_" : "slrm_test_";
    const newKey = `${prefix}${Math.random().toString(36).substring(2, 14)}`;
    setApiKeys([
      { id: Math.random().toString(), key: newKey, created: new Date().toISOString().split("T")[0] },
      ...apiKeys,
    ]);
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl flex flex-col overflow-hidden relative group">
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Key weight="fill" className="text-white size-5" />
          <h2 className="font-exo2 text-lg font-semibold text-white">{t("keysTitle")}</h2>
        </div>
        <button
          onClick={handleGenerateKey}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-onest transition-colors cursor-pointer"
        >
          <Plus weight="bold" />
          {t("generateKey")}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-[#050505]">
              <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-widest text-[#555]">{t("colKey")}</th>
              <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-widest text-[#555]">
                {t("colCreated")}
              </th>
              <th className="px-6 py-4 font-mono text-[11px] uppercase tracking-widest text-[#555] text-right">
                {t("colActions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-[#555] font-onest text-sm">
                  {t("noKeys")}
                </td>
              </tr>
            ) : (
              apiKeys.map((item) => {
                const isVisible = visibleKeys[item.id];
                const maskedKey = item.key.replace(/_(.*)$/, (_, match) => "_" + "•".repeat(match.length));

                return (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider ${item.key.includes("live") ? "bg-[#10D9B0]/10 text-[#10D9B0]" : "bg-[#F39C12]/10 text-[#F39C12]"}`}
                        >
                          {item.key.includes("live") ? "LIVE" : "TEST"}
                        </span>
                        <span className="font-mono text-white tracking-wider text-sm">
                          {isVisible ? item.key : maskedKey}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[#777] text-sm">{item.created}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleVisibility(item.id)}
                          className="p-2 rounded-lg bg-transparent hover:bg-white/5 text-[#555] hover:text-white transition-colors cursor-pointer"
                          title={isVisible ? "Hide Key" : "Reveal Key"}
                        >
                          {isVisible ? <EyeSlash size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(item.key, item.id)}
                          className="p-2 rounded-lg bg-transparent hover:bg-white/5 text-[#555] hover:text-white transition-colors cursor-pointer relative"
                          title="Copy Key"
                        >
                          {copiedKey === item.id ? (
                            <CheckCircle weight="fill" className="text-[#10D9B0]" size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
