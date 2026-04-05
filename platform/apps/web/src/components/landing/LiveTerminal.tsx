"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

export const LiveTerminal = (): JSX.Element => {
  const t = useTranslations("LiveTerminal");
  const [logs, setLogs] = useState<{ time: string; msg: string; type: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sequence = [
      { t: "info", m: "Initializing Solarium Validating Node..." },
      { t: "info", m: "Connecting to Solana RPC..." },
      { t: "success", m: "Connected. Blockheight: 201,489" },
      { t: "info", m: "Awaiting Inference Task..." },
      { t: "warn", m: "Received Task #001: Model [Llama-3-8B]" },
      { t: "info", m: "Running deterministic inference environment..." },
      { t: "info", m: "Computed Hash: 0x8f4b...29a1" },
      { t: "success", m: "Submitting Commit instruction..." },
      { t: "info", m: "Awaiting peer consensus..." },
      { t: "success", m: "Consensus reached. Oracle state appended." },
      { t: "info", m: "Listening for events..." },
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        const currentItem = sequence[i];
        setLogs((prev) => [
          ...prev,
          {
            time: new Date().toISOString().split("T")[1].slice(0, 12),
            msg: currentItem.m,
            type: currentItem.t,
          },
        ]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full xl:w-[500px] h-[450px] bg-[#111216]/90 border border-[#2A2D3A] rounded-xl flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-20 overflow-hidden relative group backdrop-blur-2xl transition-transform hover:scale-[1.01] duration-500">
      <div className="absolute inset-0 bg-[rgba(var(--accent-rgb),0.05)] mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-700" />
      <div className="h-10 border-b border-[#2A2D3A] flex items-center px-4 justify-between bg-[#16181D]">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex items-center gap-2 bg-[#000000]/30 px-2 py-0.5 rounded border border-white/5">
          <span className="text-[9px] font-mono text-[rgba(var(--accent-rgb),0.5)] uppercase tracking-widest transition-colors duration-1000">
            {t("cli")}
          </span>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-3">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-4">
            <span className="text-neutral-500 shrink-0">[{log.time}]</span>
            <span
              className={`${
                log.type === "success" ? "text-[var(--accent)] transition-colors duration-1000" : ""
              } ${log.type === "warn" ? "text-orange-400" : ""} ${log.type === "info" ? "text-neutral-300" : ""}`}
            >
              {log.msg}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
