"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const main = document.querySelector("main");
    if (main) main.style.overflowY = "hidden";

    const duration = 2800;
    const startTime = performance.now();

    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      let progressRatio = elapsed / duration;

      if (progressRatio > 1) progressRatio = 1;

      const easedProgress = easeOutQuart(progressRatio);
      const currentVal = Math.floor(easedProgress * 100);

      setProgress(currentVal);

      if (progressRatio < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setTimeout(() => {
          setIsLoading(false);

          setTimeout(() => {
            document.body.style.overflow = "";
            const main = document.querySelector("main");
            if (main) main.style.overflowY = "";
          }, 1400);
        }, 500);
      }
    };

    requestAnimationFrame(updateCounter);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div className="fixed inset-0 z-[100] flex flex-col pointer-events-none" exit={{ opacity: 1 }}>
          <motion.div
            className="w-full h-[50dvh] bg-[#050505] relative overflow-hidden"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-[1440px] px-6 lg:px-12 flex justify-between items-center z-10">
              <span className="font-outfit font-semibold tracking-[0.4em] text-white/40 text-xs md:text-sm uppercase">
                System Initializing
              </span>
              <span className="font-outfit font-light text-[clamp(8rem,18vw,18rem)] text-white tracking-tighter leading-none tabular-nums">
                {progress}
              </span>
            </div>

            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_100%,transparent_0%,#050505_100%)]" />

              <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <div className="absolute top-8 left-6 lg:left-12 flex gap-4 items-center font-mono text-[10px] text-white/40 uppercase z-20">
              <div className="w-12 h-[1px] bg-white/50" />
              <span className="tracking-widest">SLRM_PROTOCOL</span>
              <span className="text-white/20">v2.1.0-MAINNET</span>
            </div>

            <div className="absolute top-8 right-6 lg:right-12 flex gap-4 items-center font-mono text-[10px] text-white/30 uppercase z-20">
              <span>SYS_CORE</span>
              <div className="px-2 py-0.5 border border-white/10 rounded-sm bg-white/5">
                {progress < 100 ? "BOOTING" : "ONLINE"}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute top-[50dvh] left-0 h-[1px] bg-white/40 z-10"
            style={{ width: `${progress}%` }}
            exit={{ opacity: 0, scaleX: 0, x: "-50%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          />

          <motion.div
            className="absolute top-[50dvh] -ml-[2px] -mt-[1.5px] w-[4px] h-[4px] rounded-full bg-white shadow-[0_0_16px_5px_rgba(255,255,255,0.9)] z-20"
            style={{ left: `${progress}%` }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4 }}
          />

          <motion.div
            className="w-full h-[50dvh] bg-[#050505] relative overflow-hidden"
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1440px] px-6 lg:px-12 flex justify-between items-center z-10">
              <span className="font-outfit font-semibold tracking-[0.4em] text-white/40 text-xs md:text-sm uppercase">
                System Initializing
              </span>
              <span className="font-outfit font-light text-[clamp(8rem,18vw,18rem)] text-white tracking-tighter leading-none tabular-nums text-white/80">
                {progress}
              </span>
            </div>

            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] bg-[position:0_-50dvh]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,transparent_0%,#050505_100%)]" />

              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <div className="absolute bottom-8 left-6 lg:left-12 flex flex-col gap-1.5 font-mono text-[10px] uppercase text-white/30 w-full max-w-[300px] z-20">
              <div className="flex justify-between w-full">
                <span className="text-white/50 w-24">SYS_INIT</span>
                <span>Solana cluster v1.18.2</span>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 15 ? 1 : 0 }}
                className="flex justify-between w-full"
              >
                <span className="text-white/50 w-24">CPI_TUNNEL</span>
                <span>Establishing RPC</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 45 ? 1 : 0 }}
                className="flex justify-between w-full"
              >
                <span className="text-white/50 w-24">ZKTLS_AUTH</span>
                <span>Verifying cert pool</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 70 ? 1 : 0 }}
                className="flex justify-between w-full"
              >
                <span className="text-white/50 w-24">VRF_SEED</span>
                <span>Awaiting beacon entropy</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 90 ? 1 : 0 }}
                className="flex justify-between w-full"
              >
                <span className="text-white/80 w-24">NODE_READY</span>
                <span>Mounting Protocol UI</span>
              </motion.div>
            </div>

            <div className="absolute bottom-8 right-6 lg:right-12 flex flex-col items-end gap-1 font-mono text-[10px] text-white/30 uppercase z-20 tracking-widest">
              <span>Memory Allocation</span>
              <div className="text-white/60">
                0x{(progress * 0xf5b).toString(16).padStart(4, "0")} — 0x
                {(progress * 0x3e8).toString(16).padStart(4, "0")}
              </div>
              <div className="w-16 h-[2px] bg-white/10 mt-1">
                <div className="h-full bg-white/50" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
