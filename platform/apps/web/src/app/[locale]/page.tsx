"use client";

import { EclipseBackground } from "@/components/ui/EclipseBackground";
import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/landing/HeroSection";
import { Preloader } from "@/components/landing/Preloader";
import { RunningRow } from "@/components/landing/RunningRow";
import { ProtocolStack } from "@/components/landing/ProtocolStack";
import { InferenceFlow } from "@/components/landing/InferenceFlow";
import { VerifiabilityGap } from "@/components/landing/VerifiabilityGap";

import { CtaSection } from "@/components/landing/CtaSection";
import { DAppsShowcase } from "@/components/landing/DAppsShowcase";
import { SecurityArchitecture } from "@/components/landing/SecurityArchitecture";
import { Footer } from "@/components/layout/footer";

export default function App(): JSX.Element {
  return (
    <>
      <Preloader />
      <div className="flex h-screen w-full bg-[#0B0C10] text-[#E2E8F0] overflow-hidden font-sans relative transition-all duration-1000">
        <EclipseBackground />

        <Header />

        <main className="flex-1 w-full h-screen overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-none">
          <div className="w-full">
            <HeroSection />
            <RunningRow />
            <VerifiabilityGap />
            <InferenceFlow />
            <DAppsShowcase />
            <ProtocolStack />
            <SecurityArchitecture />

            <CtaSection />
            <Footer />
          </div>
        </main>
      </div>
    </>
  );
}
