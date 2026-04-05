import { Handle, Position, NodeProps, useReactFlow, Node, Edge } from "@xyflow/react";
import { Code, Gear, Database } from "@phosphor-icons/react";
import { useState, useEffect, useRef, useContext } from "react";
import { InspectorContext } from "@/app/[locale]/dashboard/polygon/page";
import { useNetwork } from "@/providers/wallet-provider";

export function DeveloperConfigNode({ id, data, isConnectable }: NodeProps) {
  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();

  const [valCount, setValCount] = useState<number>(3);
  const [rewardAmount, setRewardAmount] = useState<number>(1.5);
  const [sysPrompt, setSysPrompt] = useState<string>(
    "You are an autonomous AI agent resolving user queries with extreme precision..."
  );

  const { network } = useNetwork();
  const maxNodes = network === "devnet" ? 1 : 5;
  const maxReward = network === "devnet" ? 0.05 : 5.0;

  useEffect(() => {
    if (network === "devnet" && valCount > 1) setValCount(1);
    if (network === "devnet" && rewardAmount > 0.05) setRewardAmount(0.05);
  }, [network, valCount, rewardAmount]);

  const prevCount = useRef(3);
  const openInspector = useContext(InspectorContext);

  useEffect(() => {
    setNodes((nds) => {
      const currentNodes = nds || [];
      return currentNodes.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            data: { ...n.data, reward: rewardAmount.toString(), sysPrompt, valCount: valCount.toString() },
          };
        }
        return n;
      });
    });
  }, [valCount, rewardAmount, sysPrompt, id, setNodes]);

  useEffect(() => {
    if (valCount === prevCount.current) return;
    prevCount.current = valCount;

    setNodes((nds) => {
      const currentNodes = nds || [];
      const nonValidators = currentNodes.filter((n) => n.type !== "validator");

      const newValidators: Node[] = [];
      for (let i = 0; i < valCount; i++) {
        newValidators.push({
          id: `v-spawned-${i}`,
          type: "validator",
          position: { x: 1100, y: 350 + i * 120 },
          data: { label: `Validator Node ${i + 1}`, role: "validator", status: "idle" },
        });
      }
      return [...nonValidators, ...newValidators];
    });

    setEdges((eds) => {
      const currentEdges = eds || [];
      const nonValEdges = currentEdges.filter(
        (e) =>
          !e.target.startsWith("v-spawned-") &&
          !e.source.startsWith("v-spawned-") &&
          e.target !== "n-validator" &&
          e.source !== "n-validator"
      );

      const newEdges: Edge[] = [];
      for (let i = 0; i < valCount; i++) {
        newEdges.push({
          id: `e-es-v${i}`,
          source: "n-escrow",
          target: `v-spawned-${i}`,
          style: { stroke: "#555" },
          animated: true,
        });

        newEdges.push({
          id: `e-v${i}-cons`,
          source: `v-spawned-${i}`,
          target: "n-consensus",
          style: { stroke: "#555" },
          animated: true,
        });
      }
      return [...nonValEdges, ...newEdges];
    });
  }, [valCount, setNodes, setEdges]);

  return (
    <div className="bg-[#050505]/95 backdrop-blur-xl border border-[#8E44AD]/30 rounded-2xl min-w-[300px] shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#8E44AD]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="p-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#8E44AD]/10 rounded-md">
            <Code weight="bold" className="text-[#8E44AD] size-3.5" />
          </div>
          <span className="font-exo2 font-semibold text-white text-xs">{data.label as string}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/5 rounded-md transition-all text-[#10D9B0]"
            title="Inspect Raw JSON"
            onClick={() =>
              openInspector(
                {
                  systemPrompt: sysPrompt,
                  rewardAmount: rewardAmount,
                  rewardMint: "SOL",
                  validatorCount: valCount,
                },
                "Developer Configuration Payload"
              )
            }
          >
            <Database weight="bold" />
          </button>
          <Gear weight="fill" className="text-[#555] size-4" />
        </div>
      </div>

      <div className="p-3 flex flex-col gap-3">
        <select
          className="w-full bg-[#111] border border-white/5 rounded-md px-3 py-1.5 text-[10px] font-mono text-[#8E44AD] focus:outline-none focus:border-[#8E44AD]/50"
          onChange={(e) => {
            if (e.target.value === "insurai") {
              setSysPrompt(
                "Вы — независимый Децентрализованный Оракул системы агрострахования. Условие полиса: выплата по засухе утверждается ТОЛЬКО ЕСЛИ средняя максимальная температура за период превышала 30°C И суммарные осадки оказались ниже 10мм. Если условия ИСТИННЫ — verdict: 1. Если нет — verdict: 3."
              );
              setRewardAmount(2.5);
              setValCount(network === "devnet" ? 1 : 5);
            } else if (e.target.value === "residao") {
              setSysPrompt(
                "Ты строгий и независимый строительный аудитор ЖК. Твоя спецификация: СНиП РК и рыночные строительные расценки г. Алматы 2026 года. Внимательно проанализируй смета от подрядчика. Если цены завышены >15% или есть мошеннические услуги — verdict: 3. Иначе — verdict: 1. Обоснуй решение в reasoning."
              );
              setRewardAmount(1.5);
              setValCount(network === "devnet" ? 1 : 3);
            } else {
              setSysPrompt("You are an autonomous AI agent resolving user queries with extreme precision...");
              setRewardAmount(1.0);
              setValCount(1);
            }
          }}
        >
          <option value="custom">Standard Oracle Template</option>
          <option value="residao">ResiDAO Audit App</option>
          <option value="insurai">InsurAI Validations</option>
        </select>

        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-mono uppercase tracking-widest text-[#777]">System Logic (Prompt)</label>
          <textarea
            value={sysPrompt}
            onChange={(e) => setSysPrompt(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-2 font-mono text-[#D4D4D4] text-[9px] focus:outline-none focus:border-[#8E44AD]/50 transition-colors resize-none h-16 leading-relaxed custom-scrollbar"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-xl p-2 flex items-center justify-between">
            <span className="text-[9px] font-mono text-[#777]">Reward (SOL)</span>
            <input
              type="number"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(Math.min(maxReward, parseFloat(e.target.value) || 0))}
              step={0.01}
              className="w-16 bg-transparent text-right text-[11px] font-mono text-[#8E44AD] font-bold focus:outline-none"
            />
          </div>
          <div className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-xl p-2 flex items-center justify-between transition-colors focus-within:border-[#8E44AD]/50">
            <span className="text-[9px] font-mono text-[#777]">Validators</span>
            <input
              type="number"
              value={valCount}
              onChange={(e) => setValCount(Math.max(1, Math.min(maxNodes, parseInt(e.target.value) || 1)))}
              className="w-12 bg-transparent text-right text-[11px] font-mono text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 bg-[#8E44AD] border border-[#050505] right-[-4px]"
      />
    </div>
  );
}
