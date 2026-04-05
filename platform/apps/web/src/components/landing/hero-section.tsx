"use client";

import type { ReactNode } from "react";

function Badge(): ReactNode {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#0A0A0A]/80 px-4 py-1.5 backdrop-blur-md animate-fade-in origin-left transition-transform hover:scale-105">
      <LightningIcon />
      <span className="text-[10px] font-medium tracking-wide text-white/70">AI Oracle Live Network</span>
    </div>
  );
}

function LightningIcon(): ReactNode {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.33333 1.33334L2.66667 9.33334H8L7.33333 14.6667L14 6.66667H8.66667L9.33333 1.33334Z"
        fill="#10B981"
        stroke="#10B981"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Headline(): ReactNode {
  return (
    <h1 className="mt-8 flex flex-col font-sans">
      <span className="text-[96px] font-bold leading-[0.9] tracking-[-0.05em] text-white">Verifiable AI</span>
      <span
        className="text-[96px] font-bold leading-[0.9] tracking-[-0.05em] text-transparent"
        style={{ WebkitTextStroke: "1px rgba(16,185,129,0.8)" }}
      >
        Inference
      </span>
      <span className="text-[96px] font-bold leading-[0.9] tracking-[-0.05em] text-white">On Solana</span>
    </h1>
  );
}

function Description(): ReactNode {
  return (
    <div className="mt-10 flex items-start gap-6 max-w-[480px]">
      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#10B981] w-[80px] shrink-0 pt-1 leading-[1.6]">
        Trustless
        <br />
        Compute
      </div>
      <p className="text-[14px] leading-relaxed text-white/50 font-sans">
        We replace centralized Blackbox AI APIs with a decentralized Proof-of-Inference network. Execute AI tasks
        securely with cryptographically backed commit-reveal consensus.
      </p>
    </div>
  );
}

function Buttons(): ReactNode {
  return (
    <div className="mt-12 flex items-center gap-4">
      <button className="rounded-full border border-white/10 bg-[#151515] px-8 py-3.5 text-xs font-semibold text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-[#222]">
        Protocol Docs
      </button>
      <button className="rounded-full bg-[#10B981] px-8 py-3.5 text-xs font-bold text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#10B981]/90 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]">
        Launch Task
      </button>
    </div>
  );
}

function StatsGroup(): ReactNode {
  return (
    <div className="mt-20 flex items-end gap-16 border-t border-white/10 pt-12">
      <div className="flex flex-col gap-3">
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Total Verified</span>
        <div className="flex items-center gap-4">
          <span className="text-[34px] font-bold tracking-tight text-white font-mono">3M+</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Avg Finality</span>
        <span className="text-[34px] font-bold tracking-tight text-white/90 font-mono">{"<2s"}</span>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Active Nodes</span>
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981] animate-pulse" />
          <span className="text-[34px] font-bold tracking-tight text-[#10B981] font-mono">1.2K</span>
        </div>
      </div>
    </div>
  );
}

function HeroImage(): ReactNode {
  return (
    <div className="pointer-events-none absolute -right-[15%] top-[-5%] z-0 h-[120vh] w-[120vh]">
      <img
        src="/hero-brain-emerald.png"
        alt="AI Intelligence Nucleus"
        className="h-full w-full object-contain mix-blend-screen opacity-90 animate-float-hero"
        style={{ filter: "drop-shadow(0 0 120px rgba(16, 185, 129, 0.4))" }}
      />
    </div>
  );
}

function FloatingCards(): ReactNode {
  return (
    <div className="absolute right-[5%] top-[25%] z-20 flex flex-col gap-6">
      <div
        className="group rounded-[32px] border border-white/5 bg-[#05050A]/70 p-8 backdrop-blur-3xl transition-all duration-700 hover:border-[#10B981]/30 hover:bg-[#111111]/90 w-[280px] animate-float-slow"
        style={{ boxShadow: "0 0 60px rgba(0,0,0,0.8)" }}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#10B981]">Consensus</span>
          <div className="text-[9px] text-white/30 font-mono">LIVE</div>
        </div>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Task #4029</span>
          <div className="mt-1 text-[36px] font-bold tracking-tight text-white">REVEAL</div>
          <p className="mt-3 text-[10px] uppercase tracking-widest text-white/40 leading-[1.6]">
            Validator quorum reached
          </p>
        </div>
      </div>

      <div
        className="group rounded-[32px] border border-white/5 bg-[#05050A]/70 p-8 backdrop-blur-3xl transition-all duration-700 hover:border-[#10B981]/30 hover:bg-[#111111]/90 w-[280px] animate-float-delayed"
        style={{ boxShadow: "0 0 60px rgba(0,0,0,0.8)", transform: "translateY(20px)" }}
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#10B981]">Validator Yield</span>
        <div className="mt-6">
          <div className="text-[46px] font-bold tracking-tight text-white font-mono">18%</div>
          <p className="mt-3 text-[10px] uppercase tracking-widest text-white/40 leading-[1.6]">
            Estimated protocol APY
          </p>
        </div>
        <div className="mt-8">
          <button className="w-full rounded-2xl bg-[#1A1A1A] py-3.5 text-[10px] font-bold uppercase tracking-widest text-white/60 transition-colors hover:bg-[#10B981]/20 hover:text-[#10B981] border border-transparent hover:border-[#10B981]/30 shadow-inner">
            Register Node
          </button>
        </div>
      </div>
    </div>
  );
}

function TypographyParagraph() {
  return (
    <div className="absolute right-[25%] bottom-[8%] z-20 max-w-[480px] hidden xl:block">
      <p className="text-[26px] leading-[1.2] tracking-tight text-white/70 font-medium">
        Validating the{" "}
        <span className="text-[#10B981] font-bold text-stroke-neon mix-blend-screen">Synthetic Age.</span> Every output
        processed by Solarium ensures cryptographically proven authenticity.
      </p>
    </div>
  );
}

export function HeroSection(): ReactNode {
  return (
    <section className="relative min-h-screen w-full bg-[#020202] overflow-hidden leading-none selection:bg-[#10B981]/30">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="absolute top-[20%] right-[10%] h-[700px] w-[700px] rounded-full bg-[#10B981]/[0.08] blur-[120px] pointer-events-none" />

      <HeroImage />

      <div className="relative z-10 mx-auto flex h-full min-h-screen max-w-[1400px] flex-col justify-center px-16 pt-32 pb-20">
        <Badge />
        <Headline />
        <Description />
        <Buttons />
        <StatsGroup />
      </div>

      <FloatingCards />
      <TypographyParagraph />
    </section>
  );
}
