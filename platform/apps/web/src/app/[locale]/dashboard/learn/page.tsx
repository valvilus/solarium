"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Step1DeveloperNode } from "@/components/learn/Step1DeveloperNode";
import { Step2UserActionNode } from "@/components/learn/Step2UserActionNode";
import { Step3IPFSNode } from "@/components/learn/Step3IPFSNode";
import { Step4ContractNode } from "@/components/learn/Step4ContractNode";
import { Step5OperatorNode } from "@/components/learn/Step5OperatorNode";
import { Step6RegistryNode } from "@/components/learn/Step6RegistryNode";
import { Step7ClaimNode } from "@/components/learn/Step7ClaimNode";
import { Step8ExecutionNode } from "@/components/learn/Step8ExecutionNode";
import { Step9ConsensusNode } from "@/components/learn/Step9ConsensusNode";
import { Step10ResolutionNode } from "@/components/learn/Step10ResolutionNode";

function CanvasPanner({ step }: { step: number }) {
  const { zoomToElement } = useControls();

  useEffect(() => {
    const el = document.getElementById(`step-node-${step}`);
    if (el) {
      setTimeout(() => {
        zoomToElement(`step-node-${step}`, 1, 1000);
      }, 100);
    }
  }, [step, zoomToElement]);

  return null;
}

export default function StudyModePage() {
  const t = useTranslations("StudyModePage");
  const [currentStep, setCurrentStep] = useState(1);

  const gridStyle = {
    backgroundImage: `
      radial-gradient(circle at center, rgba(255,255,255,0.08) 1px, transparent 1px)
    `,
    backgroundSize: "24px 24px",
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#030303] relative">
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none" style={gridStyle} />

      <div className="absolute top-0 left-0 right-0 h-[68px] border-b border-white/5 bg-[#030303]/80 backdrop-blur-md z-20 px-8 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/90 text-[11px] font-mono uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#10D9B0] shadow-[0_0_10px_rgba(16,217,176,0.6)] animate-pulse" />
            {t("title")}
          </div>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-white/60 font-onest text-[13px] max-w-[600px] leading-tight">{t("description")}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[#888] font-mono text-[10px] mr-4 hidden md:block">Scroll to Zoom / Drag to Pan</div>
          <Link
            href="/dashboard/polygon"
            className="px-5 py-2.5 bg-[#4895EF]/10 text-[#4895EF] font-onest text-sm font-medium rounded-lg border border-[#4895EF]/20 hover:bg-[#4895EF]/20 transition-colors"
          >
            {t("skipToReal")}
          </Link>
        </div>
      </div>

      <div className="flex-1 w-full h-full relative z-10 overflow-hidden cursor-grab active:cursor-grabbing">
        <TransformWrapper
          initialScale={1}
          initialPositionX={50}
          initialPositionY={150}
          minScale={0.15}
          maxScale={2.5}
          wheel={{ step: 0.1 }}
          centerOnInit={false}
          limitToBounds={false}
          panning={{ velocityDisabled: true }}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <div className="min-w-[3000px] min-h-[3000px] flex items-start pt-[200px] px-[100px]">
              <div className="flex items-center">
                <div id="step-node-1" className="relative group">
                  {currentStep >= 2 && (
                    <div className="absolute right-0 top-1/2 translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#4895EF] flex items-center justify-center z-20">
                      <div className="w-2 h-2 rounded-full bg-[#4895EF] shadow-[0_0_10px_#4895EF]" />
                    </div>
                  )}
                  <Step1DeveloperNode onNext={() => setCurrentStep(2)} />
                </div>

                {currentStep >= 2 && (
                  <div className="flex items-center">
                    <div className="h-[2px] w-[140px] bg-gradient-to-r from-[#4895EF] to-[#10D9B0] relative overflow-hidden">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                    </div>

                    <div id="step-node-2" className="relative group">
                      <div className="absolute left-0 top-1/2 -translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#FFB703] flex items-center justify-center z-20">
                        <div className="w-2 h-2 rounded-full bg-[#FFB703] shadow-[0_0_10px_#FFB703] animate-pulse" />
                      </div>
                      <Step2UserActionNode onNext={() => setCurrentStep(3)} />

                      {currentStep >= 3 && (
                        <div className="absolute right-0 top-1/2 translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#FFB703] flex items-center justify-center z-20">
                          <div className="w-2 h-2 rounded-full bg-[#FFB703] shadow-[0_0_10px_#FFB703]" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep >= 3 && (
                  <div className="flex items-center">
                    <div className="h-[2px] w-[140px] bg-gradient-to-r from-[#FFB703] to-[#8ECAE6] relative overflow-hidden">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                    </div>

                    <div id="step-node-3" className="relative group">
                      <div className="absolute left-0 top-1/2 -translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#38BDF8] flex items-center justify-center z-20">
                        <div className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_10px_#38BDF8] animate-pulse" />
                      </div>
                      <Step3IPFSNode onNext={() => setCurrentStep(4)} />

                      {currentStep >= 4 && (
                        <div className="absolute right-0 top-1/2 translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#38BDF8] flex items-center justify-center z-20">
                          <div className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_10px_#38BDF8]" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep >= 4 && (
                  <div className="flex items-center">
                    <div className="h-[2px] w-[140px] bg-gradient-to-r from-[#38BDF8] to-[#10D9B0] relative overflow-visible flex items-center">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />

                      <div
                        className="absolute left-2 flex items-center gap-1.5 px-2 py-0.5 bg-[#FFB703] rounded shadow-[0_0_10px_#FFB703] z-30 pointer-events-none"
                        style={{ animation: "slideRightSol 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards" }}
                      >
                        <div className="flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 397 311" fill="#000">
                            <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
                            <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
                            <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
                          </svg>
                        </div>
                        <span className="text-[9px] font-bold text-black font-unbounded whitespace-nowrap">
                          1.50 SOL
                        </span>
                      </div>
                    </div>

                    <div id="step-node-4" className="relative group">
                      <div className="absolute left-0 top-1/2 -translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#10D9B0] flex items-center justify-center z-20">
                        <div className="w-2 h-2 rounded-full bg-[#10D9B0] shadow-[0_0_10px_#10D9B0] animate-pulse" />
                      </div>

                      <Step4ContractNode onNext={() => setCurrentStep(5)} />

                      {currentStep >= 5 && (
                        <div className="absolute right-0 top-1/2 translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#10D9B0] flex items-center justify-center z-20">
                          <div className="w-2 h-2 rounded-full bg-[#10D9B0] shadow-[0_0_10px_#10D9B0]" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep >= 5 && (
                  <div className="flex items-center">
                    <div className="h-[2px] w-[140px] bg-gradient-to-r from-[#10D9B0] to-[#A855F7] relative overflow-hidden">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                    </div>

                    <div
                      id="step-node-5"
                      className="flex flex-col items-center justify-center mx-8 animate-in zoom-in duration-500"
                    >
                      <div className="w-1.5 h-16 bg-gradient-to-b from-transparent via-[#A855F7] to-transparent rounded-full" />
                      <div className="px-6 py-2.5 rounded-xl border-y border-[#A855F7]/30 bg-[#A855F7]/5 backdrop-blur shadow-[0_0_20px_rgba(168,85,247,0.1)] flex flex-col items-center whitespace-nowrap my-4">
                        <span className="text-white/40 font-mono text-[10px] tracking-[0.2em] mb-1">MEANWHILE</span>
                        <span className="text-[#A855F7] font-unbounded text-sm tracking-widest uppercase">
                          Supply Side: AI Compute Network
                        </span>
                      </div>
                      <div className="w-1.5 h-16 bg-gradient-to-b from-transparent via-[#A855F7] to-transparent rounded-full" />
                    </div>

                    <div className="h-[2px] w-[140px] bg-gradient-to-r from-[#A855F7] to-[#A855F7] relative overflow-hidden">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                    </div>

                    <div id="step-node-5" className="relative group shrink-0">
                      <div className="absolute left-0 top-1/2 -translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#A855F7] flex items-center justify-center z-20">
                        <div className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_10px_#A855F7] animate-pulse" />
                      </div>
                      <Step5OperatorNode onNext={() => setCurrentStep(6)} />

                      {currentStep >= 6 && (
                        <div className="absolute right-0 top-1/2 translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#A855F7] flex items-center justify-center z-20">
                          <div className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_10px_#A855F7]" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep >= 6 && (
                  <div className="flex items-center shrink-0">
                    <div className="h-[2px] w-[140px] bg-[#A855F7] relative overflow-hidden shrink-0">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                    </div>

                    <div id="step-node-6" className="relative group shrink-0">
                      <div className="absolute left-0 top-1/2 -translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#A855F7] flex items-center justify-center z-20">
                        <div className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_10px_#A855F7] animate-pulse" />
                      </div>

                      <Step6RegistryNode onNext={() => setCurrentStep(7)} />

                      {currentStep >= 7 && (
                        <div className="absolute right-0 top-1/2 translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#A855F7] flex items-center justify-center z-20">
                          <div className="w-2 h-2 rounded-full bg-[#A855F7] shadow-[0_0_10px_#A855F7]" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep >= 7 && (
                  <div className="flex items-center shrink-0">
                    <div className="h-[2px] w-[140px] bg-gradient-to-r from-[#A855F7] to-[#F43F5E] relative overflow-hidden">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                    </div>

                    <div className="flex flex-col items-center justify-center mx-8 animate-in zoom-in duration-500">
                      <div className="w-1.5 h-16 bg-gradient-to-b from-transparent via-[#F43F5E] to-transparent rounded-full" />
                      <div className="px-6 py-2.5 rounded-xl border-y border-[#F43F5E]/30 bg-[#F43F5E]/5 backdrop-blur shadow-[0_0_20px_rgba(244,63,94,0.1)] flex flex-col items-center whitespace-nowrap my-4">
                        <span className="text-white/40 font-mono text-[10px] tracking-[0.2em] mb-1">INTERSECTION</span>
                        <span className="text-[#F43F5E] font-unbounded text-sm tracking-widest uppercase">
                          Network Matchmaking In Progress
                        </span>
                      </div>
                      <div className="w-1.5 h-16 bg-gradient-to-b from-transparent via-[#F43F5E] to-transparent rounded-full" />
                    </div>

                    <div className="h-[2px] w-[140px] bg-gradient-to-r from-[#F43F5E] to-[#F43F5E] relative overflow-hidden">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                    </div>

                    <div id="step-node-7" className="relative group shrink-0">
                      <div className="absolute left-0 top-1/2 -translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#F43F5E] flex items-center justify-center z-20">
                        <div className="w-2 h-2 rounded-full bg-[#F43F5E] shadow-[0_0_10px_#F43F5E] animate-pulse" />
                      </div>
                      <Step7ClaimNode onNext={() => setCurrentStep(8)} />

                      {currentStep >= 8 && (
                        <>
                          <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[2px] h-[140px] bg-gradient-to-b from-[#F43F5E] to-[#8B5CF6] overflow-hidden">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-white/50 to-transparent -translate-y-full animate-[shimmerVertical_1.5s_infinite]" />
                          </div>
                          <div className="absolute top-[100%] mt-[140px] left-[25px] z-10 flex items-center">
                            <div id="step-node-8" className="relative group shrink-0 w-[950px]">
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[6px] w-4 h-4 rounded-full bg-[#050505] border border-[#8B5CF6] flex items-center justify-center z-20">
                                <div className="w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6] animate-pulse" />
                              </div>

                              <Step8ExecutionNode onNext={() => setCurrentStep(9)} />

                              {currentStep >= 9 && (
                                <div className="absolute right-0 top-1/2 translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#8B5CF6] flex items-center justify-center z-20">
                                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
                                </div>
                              )}
                            </div>

                            {currentStep >= 9 && (
                              <div className="flex items-center shrink-0">
                                <div className="h-[2px] w-[140px] bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] relative overflow-hidden">
                                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                                </div>

                                <div id="step-node-9" className="relative group shrink-0">
                                  <div className="absolute left-0 top-1/2 -translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#38BDF8] flex items-center justify-center z-20">
                                    <div className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_10px_#38BDF8] animate-pulse" />
                                  </div>
                                  <Step9ConsensusNode onNext={() => setCurrentStep(10)} />
                                </div>
                              </div>
                            )}

                            {currentStep >= 10 && (
                              <div className="flex items-center shrink-0">
                                <div className="h-[2px] w-[140px] bg-gradient-to-r from-[#38BDF8] to-[#10D9B0] relative overflow-hidden">
                                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                                </div>

                                <div id="step-node-10" className="relative group shrink-0">
                                  <div className="absolute left-0 top-1/2 -translate-x-[6px] -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#10D9B0] flex items-center justify-center z-20">
                                    <div className="w-2 h-2 rounded-full bg-[#10D9B0] shadow-[0_0_10px_#10D9B0] animate-pulse" />
                                  </div>
                                  <Step10ResolutionNode />

                                  <div className="absolute bottom-[100%] right-[30%] w-[2px] h-[300px] bg-gradient-to-t from-[#10D9B0] to-transparent opacity-50 overflow-hidden pointer-events-none">
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent via-white/80 to-transparent translate-y-full animate-[shimmerVerticalUp_2s_infinite]" />
                                    <span className="absolute top-0 right-4 text-[#10D9B0] text-[10px] font-mono tracking-widest uppercase rotate-90 origin-right whitespace-nowrap">
                                      Callback to DApp
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes slideRightSol {
                          0% { transform: translateX(0px); opacity: 0; }
                          10% { opacity: 1; }
                          80% { opacity: 1; }
                          100% { transform: translateX(110px); opacity: 0; }
                        }
                        @keyframes shimmerVertical {
                          100% { transform: translateY(100%); }
                        }
                        @keyframes shimmerVerticalUp {
                          0% { transform: translateY(100%); }
                          100% { transform: translateY(-100%); }
                        }
                     `,
                  }}
                />
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}
