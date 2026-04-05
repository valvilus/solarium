import type { ReactNode } from "react";

const CODE_LINES = [
  'import { SolariumClient } from "@solarium-labs/sdk";',
  "",
  "const client = new SolariumClient(provider);",
  "",
  "const { taskId } = await client.createTask({",
  '  inputHash: sha256("Analyze this transaction"),',
  "  taskType: TaskType.Analyze,",
  "  tier: 3,",
  "  reward: new BN(0.1 * LAMPORTS_PER_SOL),",
  "  validatorCount: 2,",
  "});",
  "",
  "const task = await client.fetchTask(taskId);",
] as const;

export function NodeSnippet(): ReactNode {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            <span className="gradient-text">3 Lines</span> to Verifiable AI
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-surface-400">
            Our SDK abstracts all PDA derivation and account resolution. Just pass your parameters.
          </p>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-surface-700/50 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-accent-red/70" />
            <span className="h-3 w-3 rounded-full bg-accent-amber/70" />
            <span className="h-3 w-3 rounded-full bg-accent-green/70" />
            <span className="ml-3 text-xs text-surface-500">create-task.ts</span>
          </div>

          <pre className="overflow-x-auto p-6">
            <code className="font-mono text-sm leading-relaxed">
              {CODE_LINES.map((line, i) => (
                <CodeLine key={i} number={i + 1} content={line} />
              ))}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

type CodeLineProps = {
  readonly number: number;
  readonly content: string;
};

function CodeLine({ number, content }: CodeLineProps): ReactNode {
  return (
    <div className="flex">
      <span className="mr-6 inline-block w-6 text-right text-surface-600 select-none">{number}</span>
      <span className="text-surface-300">{content}</span>
    </div>
  );
}
