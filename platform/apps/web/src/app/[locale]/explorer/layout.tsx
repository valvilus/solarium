"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col font-sans selection:bg-[#4895EF]/30 selection:text-white">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#10D9B0]/[0.02] to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Header />
      <main className="flex-1 pt-32 pb-20 px-6 xl:px-12 max-w-[1440px] mx-auto w-full relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
