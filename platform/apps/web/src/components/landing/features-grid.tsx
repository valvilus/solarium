"use client";

import type { ReactNode } from "react";
import { ShieldCheck, Lightning, CurrencyDollar, Brain, CloudArrowUp, Lock } from "@phosphor-icons/react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Commit-Reveal Consensus",
    description: "Multi-agent verification with cryptographic commit-reveal scheme prevents collusion.",
  },
  {
    icon: Lightning,
    title: "Solana Speed",
    description: "Sub-second finality. Tasks are created, verified, and rewarded in real time.",
  },
  {
    icon: CurrencyDollar,
    title: "Staking Economy",
    description: "Workers and validators stake SOL. Honest behavior is rewarded, fraud is slashed.",
  },
  {
    icon: Brain,
    title: "Model Agnostic",
    description: "Run any AI model. The protocol verifies outputs, not the model itself.",
  },
  {
    icon: CloudArrowUp,
    title: "Verifiable Traces",
    description: "Every inference result includes a cryptographic trace hash stored on-chain.",
  },
  {
    icon: Lock,
    title: "Trustless by Design",
    description: "No central authority. PDA-based escrow and automated reward distribution.",
  },
] as const;

type FeatureCardProps = {
  readonly icon: React.ElementType;
  readonly title: string;
  readonly description: string;
};

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps): ReactNode {
  return (
    <div className="glass-card group p-6 transition-all duration-300 hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5">
      <div className="mb-4 inline-flex rounded-xl bg-brand-500/10 p-3 text-brand-400 transition-colors group-hover:bg-brand-500/20">
        <Icon weight="duotone" className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-surface-400">{description}</p>
    </div>
  );
}

export function FeaturesGrid(): ReactNode {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Why <span className="gradient-text">Solarium</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-surface-400">
            Purpose-built infrastructure for verifiable AI on the fastest chain.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
