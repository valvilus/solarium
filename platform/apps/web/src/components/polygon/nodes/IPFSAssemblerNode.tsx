import { Handle, Position, NodeProps } from "@xyflow/react";
import { FileCode, ShieldCheck, Database } from "@phosphor-icons/react";
import { useContext } from "react";
import { InspectorContext } from "@/app/[locale]/dashboard/polygon/page";

export function IPFSAssemblerNode({ data, isConnectable }: NodeProps) {
  const status = data.status || "idle";
  const openInspector = useContext(InspectorContext);
  const hash = data.hash || "QmYa2...8xK";

  return (
    <div className="bg-[#050505]/95 backdrop-blur-xl border border-[#F39C12]/30 rounded-2xl min-w-[280px] shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative group">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 bg-[#F39C12] border border-[#050505] left-[-4px]"
      />

      <div className="p-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#F39C12]/10 rounded-md">
            <FileCode weight="fill" className="text-[#F39C12] size-3.5" />
          </div>
          <span className="font-exo2 font-semibold text-white text-xs">{data.label as string}</span>
        </div>

        <div className="flex items-center gap-2">
          {status === "uploading" && (
            <span className="text-[9px] text-[#F39C12] uppercase font-mono animate-pulse">Hashing...</span>
          )}
          <button
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded-md transition-all text-[#10D9B0]"
            title="Inspect IPFS Payload"
            onClick={() =>
              openInspector(
                {
                  version: "1.0",
                  schema: "solarium-inference",
                  cid: hash,
                  content: { prompt: "...", timestamp: Date.now() },
                },
                "IPFS Manifest Payload"
              )
            }
          >
            <Database weight="bold" />
          </button>
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-2 font-mono text-[9px] text-[#777] h-16 overflow-hidden relative">
          {'{\n  "version": "1.0",\n  "schema": "..." \n}'}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]" />
        </div>

        {status === "success" && (
          <div className="bg-[#10D9B0]/10 border border-[#10D9B0]/20 rounded-md p-2 flex items-center gap-2">
            <ShieldCheck className="text-[#10D9B0] size-3" />
            <span className="font-mono text-[#10D9B0] text-[9px] truncate">CID: QmYa2...8xK</span>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 bg-[#F39C12] border border-[#050505] right-[-4px]"
      />
    </div>
  );
}
