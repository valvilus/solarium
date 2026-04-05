"use client";

import { useEffect, useState } from "react";

export const EclipseBackground = (): JSX.Element => {
  const [streams, setStreams] = useState<{ left: string; dur: string; del: string }[]>([]);

  useEffect(() => {
    setStreams(
      [...Array(10)].map(() => ({
        left: `${Math.random() * 100}%`,
        dur: `${3 + Math.random() * 4}s`,
        del: `${Math.random() * 5}s`,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none fixed">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes fall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .bg-tech-grid {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .data-stream {
          width: 1px;
          height: 120px;
          background: linear-gradient(to bottom, transparent, rgba(var(--accent-rgb),0.5), transparent);
          position: absolute;
          animation: fall linear infinite;
        }
      `,
        }}
      />

      <div className="absolute inset-0 bg-tech-grid opacity-[0.2]" />

      <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-30 transition-all duration-1000">
        {streams.map((s, i) => (
          <div
            key={i}
            className="data-stream"
            style={{
              left: s.left,
              animationDuration: s.dur,
              animationDelay: s.del,
            }}
          />
        ))}
      </div>

      <div
        className="fixed top-[-10%] sm:top-[20%] right-[-20%] sm:right-[-5%] w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full mix-blend-screen transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle, transparent 40%, rgba(var(--accent-rgb), 0.05) 50%, transparent 65%)`,
          animation: "pulse-glow 8s ease-in-out infinite",
        }}
      >
        <div
          className="absolute inset-0 rounded-full transition-colors duration-1000"
          style={{
            animation: "rotate-slow 150s linear infinite",
            border: `1px dashed rgba(var(--accent-rgb), 0.1)`,
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full blur-[150px] opacity-[0.10] transition-colors duration-1000 bg-[var(--accent)]" />
      </div>
    </div>
  );
};
