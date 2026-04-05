"use client";

import { User, Code, Database, FileCode, Lightning, ShieldCheck, Sword } from "@phosphor-icons/react";
import { useContext } from "react";
import { ExplainerContext } from "@/app/[locale]/dashboard/polygon/page";

const NODE_TYPES = [
  { type: "userInput", label: "User Input", icon: User, color: "#4895EF" },
  { type: "devConfig", label: "Developer Config", icon: Code, color: "#8E44AD" },
  { type: "ipfsManifest", label: "IPFS Builder", icon: FileCode, color: "#F39C12" },
  { type: "escrow", label: "Escrow Contract", icon: Database, color: "#10D9B0" },
  { type: "worker", label: "Worker Agent", icon: Lightning, color: "#4895EF" },
  { type: "validator", label: "Validator Agent", icon: ShieldCheck, color: "#F39C12" },
  { type: "consensus", label: "Consensus Finality", icon: Sword, color: "#E74C3C" },
];

export function NodePalette() {
  const openExplainer = useContext(ExplainerContext);

  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify({ type: nodeType, label }));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="absolute right-6 top-24 bottom-6 w-60 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-500 delay-200 fill-mode-both">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <span className="font-exo2 text-white font-semibold text-sm">Components</span>
        <span className="text-[9px] text-[#777] uppercase font-mono">Drag or Click</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {NODE_TYPES.map((node) => (
          <div
            key={node.type}
            onDragStart={(e) => onDragStart(e, node.type, node.label)}
            onClick={() => openExplainer(node.type)}
            draggable
            className="flex items-center gap-3 p-3 text-xs rounded-xl border border-white/5 bg-[#050505] hover:border-white/20 cursor-pointer active:cursor-grabbing transition-colors group"
          >
            <div
              className="p-2 rounded-lg transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${node.color}15` }}
            >
              <node.icon weight="fill" color={node.color} className="size-4" />
            </div>
            <span className="text-white font-mono">{node.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
