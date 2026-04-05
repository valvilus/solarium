import { Handle, Position, NodeProps } from "@xyflow/react";
import { Cpu, Play, MagicWand, Lightning, Key } from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export type DAppNodeData = {
  label?: string;
  onDeploy?: (prompt: string, useBurner: boolean) => Promise<void>;
  status?: "idl" | "deploying" | "success" | "error";
};

export function DAppTriggerNode({ data, isConnectable }: NodeProps) {
  const t = useTranslations("Polygon");
  const typedData = data as DAppNodeData;
  const [prompt, setPrompt] = useState("");
  const [useBurner, setUseBurner] = useState(true);

  const handleDeploy = async () => {
    if (typedData.onDeploy && prompt.trim()) {
      await typedData.onDeploy(prompt, useBurner);
    }
  };

  return (
    <div className="bg-[#050505]/90 backdrop-blur-xl border border-white/10 rounded-2xl min-w-[320px] shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative group transition-all hover:border-[#10D9B0]/50">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10D9B0]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#10D9B0]/10 rounded-lg">
            <Cpu weight="fill" className="text-[#10D9B0] size-4" />
          </div>
          <span className="font-exo2 font-semibold text-white text-sm">{typedData.label || "DApp Trigger"}</span>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${typedData.status === "deploying" ? "bg-yellow-500 animate-pulse" : typedData.status === "success" ? "bg-green-500" : "bg-[#555]"}`}
        />
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-[#777] uppercase">Input Prompt</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={typedData.status === "deploying" || typedData.status === "success"}
            className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl p-3 font-mono text-white text-xs focus:outline-none focus:border-[#10D9B0] transition-colors resize-none h-20"
            placeholder="E.g. Analyze market conditions and fetch weather data..."
          />
        </div>

        <div className="flex bg-[#0A0A0A] border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => setUseBurner(true)}
            disabled={typedData.status === "deploying"}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all ${useBurner ? "bg-white/10 text-white" : "text-[#555] hover:text-white"}`}
          >
            <MagicWand weight="bold" /> Burner
          </button>
          <button
            onClick={() => setUseBurner(false)}
            disabled={typedData.status === "deploying"}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all ${!useBurner ? "bg-white/10 text-[#4895EF]" : "text-[#555] hover:text-[#4895EF]"}`}
          >
            <Key weight="bold" /> Phantom
          </button>
        </div>

        <button
          onClick={handleDeploy}
          disabled={!prompt.trim() || typedData.status === "deploying" || typedData.status === "success"}
          className="w-full py-3 rounded-xl bg-[#10D9B0] text-black font-onest font-bold flex items-center justify-center gap-2 hover:bg-[#10D9B0]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group text-sm"
        >
          {typedData.status === "deploying" ? (
            <span className="flex items-center gap-2 animate-pulse">
              <Lightning weight="bold" className="size-4" /> Deploying...
            </span>
          ) : typedData.status === "success" ? (
            "Deployed to Network"
          ) : (
            <span className="flex items-center gap-2 group-hover:scale-105 transition-transform">
              <Play weight="fill" className="size-4" /> Broadcast Task
            </span>
          )}
        </button>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-[#10D9B0] border border-black right-[-6px]"
      />
    </div>
  );
}
