import { Handle, Position, NodeProps } from "@xyflow/react";
import { Database, ShieldCheck, Sword, CheckCircle, Warning, Lock, Cpu, ArrowsClockwise } from "@phosphor-icons/react";

export type ConsensusNodeData = {
  label?: string;
  verdict?: "pending" | "success" | "slashed";
  transactionSignature?: string;
  workerHash?: string;
  validatorHash?: string;
  workerVerdict?: number;
  workerReasoning?: string;
  taskId?: string;
  validatorCount?: number;
};

const VERDICT_MAP: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "APPROVED", color: "text-[#10D9B0]", bg: "bg-[#10D9B0]/15 border-[#10D9B0]/30" },
  2: { label: "SUSPICIOUS", color: "text-[#F39C12]", bg: "bg-[#F39C12]/15 border-[#F39C12]/30" },
  3: { label: "SUSPICIOUS", color: "text-[#F39C12]", bg: "bg-[#F39C12]/15 border-[#F39C12]/30" },
  4: { label: "REJECTED", color: "text-[#E74C3C]", bg: "bg-[#E74C3C]/15 border-[#E74C3C]/30" },
};

function shortenHash(hash: string | undefined, len = 8): string {
  if (!hash) return "—";
  return `${hash.substring(0, len)}...${hash.substring(hash.length - 4)}`;
}

export function ConsensusNode({ data, isConnectable }: NodeProps) {
  const typedData = data as ConsensusNodeData;
  const isFinalized = typedData.verdict === "success";
  const isSlashed = typedData.verdict === "slashed";
  const isPending = !isFinalized && !isSlashed;

  const verdictInfo = typedData.workerVerdict ? VERDICT_MAP[typedData.workerVerdict] : null;
  const borderClass = isFinalized ? "border-[#10D9B0]/40" : isSlashed ? "border-[#E74C3C]/40" : "border-white/5";

  return (
    <div
      className={`bg-[#050505]/95 backdrop-blur-xl border rounded-2xl w-[440px] shadow-[0_8px_32px_rgba(0,0,0,0.9)] relative transition-all ${borderClass}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20 pointer-events-none" />

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-[#222] border border-black left-[-6px]"
      />

      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0A0A0A] border border-white/5 rounded-lg">
            <Database weight="regular" className="text-[#A569BD] size-4" />
          </div>
          <span className="font-onest font-medium text-white/90 text-[13px] tracking-wide uppercase">
            {typedData.label || "Finalize (Smart Contract)"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isPending ? (
            <span className="flex items-center gap-1.5 text-[#555] font-mono text-[9px] uppercase tracking-widest border border-white/5 px-2.5 py-1.5 rounded-md bg-[#0A0A0A]">
              <ArrowsClockwise size={10} className="animate-spin" />
              Listening
            </span>
          ) : isFinalized ? (
            <span className="flex items-center gap-1.5 text-[#10D9B0] font-mono text-[9px] uppercase tracking-widest border border-[#10D9B0]/20 px-2.5 py-1.5 rounded-md bg-[#10D9B0]/5">
              <CheckCircle weight="fill" size={12} />
              Finalized
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[#E74C3C] font-mono text-[9px] uppercase tracking-widest border border-[#E74C3C]/20 px-2.5 py-1.5 rounded-md bg-[#E74C3C]/5">
              <Warning weight="fill" size={12} />
              Slashed
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="bg-[#030303] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
            <Lock size={10} className="text-[#555]" />
            <span className="text-[9px] font-mono text-[#555] uppercase tracking-widest">On-Chain State</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {[
              { label: "Program", value: "8pUwQg...K4KUMd" },
              {
                label: "State Machine",
                value: isPending ? "Committed → Revealing" : isFinalized ? "Finalized ✓" : "Disputed",
              },
              { label: "Task ID", value: typedData.taskId ?? "task_0" },
              { label: "Consensus Type", value: "Optimistic (2/3 + 1)" },
              { label: "Worker Commit", value: shortenHash(typedData.workerHash, 10) },
              { label: "Validator Commit", value: shortenHash(typedData.validatorHash, 10) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-3 py-2">
                <span className="text-[9px] font-mono text-[#555]">{label}</span>
                <span className="text-[9px] font-mono text-[#aaa] text-right max-w-[200px] truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {!isPending && (
          <div className="bg-[#030303] border border-white/5 rounded-xl overflow-hidden">
            <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu size={10} className="text-[#555]" />
                <span className="text-[9px] font-mono text-[#555] uppercase tracking-widest">Worker LLM Output</span>
              </div>
              {verdictInfo && (
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${verdictInfo.color} ${verdictInfo.bg}`}
                >
                  {verdictInfo.label}
                </span>
              )}
            </div>

            <div className="px-3 py-2.5 max-h-[96px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <p className="text-[9px] text-[#888] font-mono leading-relaxed italic">
                "{typedData.workerReasoning || "Awaiting inference result..."}"
              </p>
            </div>
          </div>
        )}

        {isFinalized && (
          <div className="w-full bg-[#10D9B0]/5 border border-[#10D9B0]/20 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <ShieldCheck weight="regular" size={13} className="text-[#10D9B0] shrink-0" />
            <span className="text-[9px] font-mono text-[#10D9B0]">Hashes matched. Optimistic Finality Achieved.</span>
          </div>
        )}

        {isSlashed && (
          <div className="w-full bg-[#E74C3C]/5 border border-[#E74C3C]/20 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <Sword weight="regular" size={13} className="text-[#E74C3C] shrink-0" />
            <span className="text-[9px] font-mono text-[#E74C3C]">Hash mismatch detected. Stake slashed on-chain.</span>
          </div>
        )}

        {typedData.transactionSignature && (
          <a
            href={`https://explorer.solana.com/tx/${typedData.transactionSignature}?cluster=custom&customUrl=http://127.0.0.1:8899`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 flex items-center justify-center font-mono text-[9px] text-[#444] hover:text-[#10D9B0] transition-colors border border-white/5 hover:border-[#10D9B0]/20 rounded-xl bg-[#0A0A0A] hover:bg-[#10D9B0]/5"
          >
            View Transaction →
          </a>
        )}
      </div>
    </div>
  );
}
