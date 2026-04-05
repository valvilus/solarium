import { Handle, Position, NodeProps } from "@xyflow/react";
import { Sword, WarningCircle } from "@phosphor-icons/react";

export function DisputeNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="bg-[#E74C3C]/5 backdrop-blur-xl border border-[#E74C3C]/30 rounded-2xl min-w-[280px] shadow-[0_8px_32px_rgba(231,76,60,0.1)] relative group">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 bg-[#E74C3C] border border-[#050505] left-[-4px]"
      />

      <div className="p-3 border-b border-[#E74C3C]/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#E74C3C]/20 rounded-md">
            <Sword weight="bold" className="text-[#E74C3C] size-3.5" />
          </div>
          <span className="font-exo2 font-semibold text-white text-xs">{data.label as string}</span>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-3">
        <div className="bg-[#050505] border border-[#E74C3C]/20 rounded-xl p-2.5 flex items-start gap-2">
          <WarningCircle className="text-[#E74C3C] size-3.5 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-[#E74C3C] uppercase tracking-widest">Spoof Result</span>
            <span className="font-mono text-[8px] text-[#777]">Trigger a malicious response...</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2 border border-[#E74C3C]/50 text-[#E74C3C] hover:bg-[#E74C3C]/10 rounded-lg text-[11px] font-bold font-onest transition-colors">
          Raise Dispute (Slash)
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 bg-[#E74C3C] border border-[#050505] right-[-4px]"
      />
    </div>
  );
}
