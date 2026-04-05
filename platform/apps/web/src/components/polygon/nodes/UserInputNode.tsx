import { Handle, Position, NodeProps } from "@xyflow/react";
import { User, TextT, Database } from "@phosphor-icons/react";
import { useState, useContext } from "react";
import { InspectorContext } from "@/app/[locale]/dashboard/polygon/page";

export function UserInputNode({ data, isConnectable }: NodeProps) {
  const onPromptChange = data.onPromptChange as ((val: string) => void) | undefined;
  const prompt = (data.prompt as string) || "";
  const openInspector = useContext(InspectorContext);

  const handlePromptChange = (val: string) => {
    if (onPromptChange) onPromptChange(val);
  };

  return (
    <div className="bg-[#050505]/95 backdrop-blur-xl border border-[#4895EF]/30 rounded-2xl min-w-[280px] shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#4895EF]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#4895EF]/10 rounded-md">
            <User weight="fill" className="text-[#4895EF] size-3.5" />
          </div>
          <span className="font-exo2 font-semibold text-white text-xs">{data.label as string}</span>
        </div>

        <button
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded-md transition-all text-[#10D9B0]"
          title="Inspect Raw JSON"
          onClick={() => openInspector({ prompt: prompt || "User input..." }, "User Input Payload")}
        >
          <Database weight="bold" />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-3">
        <select
          className="w-full bg-[#111] border border-white/5 rounded-md px-3 py-1.5 text-[10px] font-mono text-[#4895EF] focus:outline-none focus:border-[#4895EF]/50"
          onChange={(e) => {
            if (e.target.value === "insurai") {
              handlePromptChange(
                '{\n  "policyId": "POL-[AGRO-DEMO]",\n  "farmerStatement": "Гибель 100% урожая. Дождей не было, аномальная жара.",\n  "officialWeatherData": [\n    { "temp_max": 32.1, "precip": 0.0 }\n  ]\n}'
              );
            } else if (e.target.value === "residao") {
              handlePromptChange(
                '{\n  "title": "Очистка кармы ЖК",\n  "contractor": "Magi...1bC",\n  "amount": 1500,\n  "description": "1. Выезд специалиста - $500\\n2. Раскуривание благовоний - $200\\n3. Энергетическая балансировка - $800"\n}'
              );
            } else {
              handlePromptChange('{"query": "What is the current weather in Tokyo?"}');
            }
          }}
        >
          <option value="custom">Standard Oracle Query</option>
          <option value="residao">ResiDAO Simulation</option>
          <option value="insurai">InsurAI Simulation</option>
        </select>

        <div className="relative">
          <div className="absolute top-2.5 left-3 text-[#555] pointer-events-none">
            <TextT weight="bold" size={14} />
          </div>
          <textarea
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 pl-9 font-mono text-[#00FF41] text-[9px] focus:outline-none focus:border-[#4895EF]/50 transition-colors resize-none h-24 leading-relaxed custom-scrollbar whitespace-pre"
            placeholder="User input JSON..."
          />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 bg-[#4895EF] border border-[#050505] right-[-4px]"
      />
    </div>
  );
}
