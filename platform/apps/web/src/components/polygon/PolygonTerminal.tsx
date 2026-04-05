"use client";

import { useState, useEffect, useRef } from "react";

interface PolygonTerminalProps {
  pubkey: string;
  role: "worker" | "validator";
}

export function PolygonTerminal({ pubkey, role }: PolygonTerminalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (!pubkey || pubkey.startsWith("Simulated")) {
      setLogs([
        "[SYSTEM] Initiating Graceful Fallback Simulation...",
        '[POLYGON_METRIC] { "type": "SIMULATED", "value": "BOOT" }',
        "Connected to simulated stream...",
      ]);
      const interval = setInterval(() => {
        setLogs((prev) => {
          const newLogs = [...prev, `[POLYGON_METRIC] { "type": "TICK", "timestamp": ${Date.now()} }`];
          if (newLogs.length > 50) return newLogs.slice(newLogs.length - 50);
          return newLogs;
        });
      }, 5000);
      return () => clearInterval(interval);
    }

    setLogs(["[SYSTEM] SECURE DOCKER CONNECTION ESTABLISHED", `ATTACHING TO STREAM: ${pubkey.substring(0, 6)}...`]);

    const es = new EventSource(`/api/nodes/logs?pubkey=${pubkey}&role=${role}`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLogs((prev) => {
          const newLogs = [...prev, data.text];

          if (newLogs.length > 100) return newLogs.slice(newLogs.length - 100);
          return newLogs;
        });

        if (data.text && (data.text.includes("[POLYGON_METRIC]") || data.text.includes("No such container"))) {
          window.dispatchEvent(
            new CustomEvent("polygon_stream_event", {
              detail: { payload: data, pubkey, role },
            })
          );
        }
      } catch (e) {
        setLogs((prev) => [...prev, event.data]);
      }
    };

    es.onerror = () => {
      setLogs((prev) => [...prev, `[SYSTEM] STREAM INTERRUPTED`]);
      es.close();
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [pubkey, role]);

  return (
    <div className="flex flex-col bg-black w-full h-full font-mono text-[9px] md:text-[10px] tracking-wide relative">
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] pointer-events-none z-10"
        style={{ backgroundSize: "100% 2px, 3px 100%" }}
      />

      <div
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-[#10D9B0]/20 scrollbar-track-transparent"
      >
        {logs.map((log, i) => (
          <div
            key={i}
            className={`flex gap-1.5 ${log.includes("[SYSTEM]") ? "text-[#777]" : log.includes("[ERROR]") || log.includes("[WARNING]") ? "text-[#FF1515]" : log.includes("[POLYGON_METRIC]") ? "text-[#8E44AD]" : "text-[#10D9B0]"}`}
          >
            <span className="opacity-40 select-none">❯</span>
            <span className="break-all whitespace-pre-wrap">{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
