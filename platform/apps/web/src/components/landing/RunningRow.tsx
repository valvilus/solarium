"use client";

import { motion } from "framer-motion";

const FEATURES = [
  "VERIFIABLE AI",
  "OPTIMISTIC CONSENSUS",
  "ZERO-TRUST ARCHITECTURE",
  "CRYPTOGRAPHIC PROOFS",
  "ON-CHAIN SLASHING",
  "AGENTIC SWARMS",
  "DECENTRALIZED ORACLES",
  "SUB-SECOND FINALITY",
];

export function RunningRow() {
  return (
    <section className="relative w-full py-6 lg:py-10 bg-[#050505] overflow-hidden border-y border-white/5 flex items-center h-[12vh] min-h-[80px]">
      <div className="absolute left-0 top-0 bottom-0 w-[15vw] max-w-[200px] bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-[15vw] max-w-[200px] bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex whitespace-nowrap items-center w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 60, repeat: Infinity }}
      >
        {[...FEATURES, ...FEATURES, ...FEATURES, ...FEATURES].map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex flex-row items-center justify-center px-10 opacity-70 hover:opacity-100 hover:text-white transition-all duration-500 cursor-none"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="square"
              className="text-[#FFFFFF] mr-10"
            >
              <path d="M12 5v14m-7-7h14" />
            </svg>

            <span
              className={`font-exo2 text-[clamp(2rem,3vw,3rem)] font-bold tracking-widest uppercase ${
                i % 2 === 1
                  ? "text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.6)] hover:[-webkit-text-stroke:1.5px_rgba(255,255,255,1)]"
                  : "text-white"
              }`}
            >
              {item}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
