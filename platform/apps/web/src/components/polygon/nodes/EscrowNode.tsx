import { Handle, Position, NodeProps } from "@xyflow/react";
import { Database, Play, LockKey } from "@phosphor-icons/react";

export function EscrowNode({ data, isConnectable }: NodeProps) {
  return (
    <div className="bg-[#050505]/95 backdrop-blur-xl border border-[#10D9B0]/30 rounded-2xl min-w-[280px] shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative group">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 bg-[#10D9B0] border border-[#050505] left-[-4px]"
      />

      <div className="p-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#10D9B0]/10 rounded-md">
            <Database weight="fill" className="text-[#10D9B0] size-3.5" />
          </div>
          <span className="font-exo2 font-semibold text-white text-xs">{data.label as string}</span>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-3">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-2.5 flex items-start gap-2">
          <LockKey className="text-[#555] size-3.5 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-white">Funds Secured</span>
            <span className="font-mono text-[8px] text-[#777]">Waiting for network push...</span>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2 bg-[#10D9B0] text-black rounded-lg text-[11px] font-bold font-onest hover:opacity-90 transition-opacity">
          <Play weight="fill" className="size-3" /> Execute CPI (CreateTask)
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 bg-[#10D9B0] border border-[#050505] right-[-4px]"
      />
    </div>
  );
}
