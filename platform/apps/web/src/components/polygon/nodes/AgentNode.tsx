import { Handle, Position, NodeProps } from "@xyflow/react";
import { Lightning, ShieldCheck, Terminal, Trash, Play } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { PolygonTerminal } from "@/components/polygon/PolygonTerminal";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export type AgentNodeData = {
  role: "worker" | "validator";
  label?: string;
  onDeployAgent?: (apiKey: string) => Promise<boolean>;
  onKillAgent?: () => Promise<void>;
  status?: "idle" | "spawning" | "running" | "success" | "disputed";
  pubkey?: string;
  operatorPubkey?: string;
};

export function AgentNode({ data, isConnectable }: NodeProps) {
  const typedData = data as AgentNodeData;
  const isWorker = typedData.role === "worker";

  const [apiKey, setApiKey] = useState("AIzaSyDM7BGbljdqfe0AqwynjZyqQZKdn7R63dk");
  const [realBalance, setRealBalance] = useState<number | null>(null);
  const { connection } = useConnection();

  const nodeIconColor = isWorker ? "#10D9B0" : "#A569BD";

  useEffect(() => {
    if (typedData.pubkey && !typedData.pubkey.startsWith("Simulated") && connection) {
      try {
        const pkey = new PublicKey(typedData.pubkey);
        connection.getBalance(pkey).then((b) => setRealBalance(b / LAMPORTS_PER_SOL));

        const sub = connection.onAccountChange(pkey, (info) => {
          setRealBalance(info.lamports / LAMPORTS_PER_SOL);
        });

        return () => {
          connection.removeAccountChangeListener(sub);
        };
      } catch (e) {
        console.warn("Invalid pubkey:", typedData.pubkey);
      }
    }
  }, [typedData.pubkey, connection]);

  return (
    <div className="bg-[#050505]/95 backdrop-blur-xl border border-white/5 rounded-2xl w-[420px] shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative group transition-all">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: "#222" }}
        className="w-3 h-3 border border-black left-[-6px]"
      />

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20 pointer-events-none" />

      <div className="p-4 border-b border-white/5 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#0A0A0A] border border-white/5">
            {isWorker ? (
              <Lightning weight="regular" color={nodeIconColor} className="size-4" />
            ) : (
              <ShieldCheck weight="regular" color={nodeIconColor} className="size-4" />
            )}
          </div>
          <span className="font-onest font-medium text-white/90 text-[13px] tracking-wide uppercase">
            {typedData.label || (isWorker ? "Worker Node" : "Validator Node")}
          </span>
        </div>

        <div className="flex items-center gap-2 relative z-20 pointer-events-auto">
          <div className="px-2.5 py-1.5 bg-[#0A0A0A] border border-white/5 rounded-md flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-[#555]">STAKE:</span>
            <span
              className={`text-[10px] font-mono font-bold tracking-widest ${typedData.status === "idle" || typedData.status === "spawning" ? "text-[#555]" : "text-white"}`}
            >
              {typedData.status === "idle" || typedData.status === "spawning"
                ? "UNREGISTERED"
                : realBalance !== null
                  ? `${realBalance.toFixed(2)} SOL`
                  : typedData.pubkey
                    ? "10.00 SOL"
                    : "10.00 SOL"}
            </span>
          </div>

          {["running", "success"].includes(typedData.status || "") && typedData.onKillAgent && (
            <button
              onClick={typedData.onKillAgent}
              className="text-[#555] hover:text-[#E74C3C] transition-colors bg-[#111] hover:bg-[#E74C3C]/10 border border-white/5 p-1.5 rounded-md ml-1 cursor-pointer"
            >
              <Trash weight="regular" size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 relative z-10">
        <div className="h-[220px] w-full rounded-xl overflow-hidden border border-white/5 relative bg-[#030303] shadow-inner flex flex-col">
          {typedData.status !== "running" && typedData.status !== "success" ? (
            <div className="flex-1 flex flex-col items-center justify-center relative font-mono text-[10px] tracking-[0.2em]">
              <div
                className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,255,255,0.01),rgba(0,0,0,0.01))] pointer-events-none"
                style={{ backgroundSize: "100% 2px, 3px 100%" }}
              />
              {typedData.status === "spawning" ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="size-5 border border-[#555] border-t-white rounded-full animate-spin" />
                  <span className="text-[#888] animate-pulse">BOOTING CONTAINER...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 opacity-40">
                  <span className="text-[#555]">STANDING BY</span>
                  <span className="text-[#333] text-[8px]">AWAITING ORCHESTRATION</span>
                </div>
              )}
            </div>
          ) : (
            <>
              {typedData.pubkey && (
                <div className="absolute top-2 right-2 z-20 bg-[#0A0A0A]/90 px-2 flex items-center gap-2 py-1 rounded border border-white/5 text-[8px] font-mono text-[#777] backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10D9B0] animate-pulse" />
                  H-WALLET: {typedData.pubkey.slice(0, 4)}...{typedData.pubkey.slice(-4)}
                </div>
              )}
              <div className="flex-1 overflow-hidden relative">
                <PolygonTerminal pubkey={typedData.operatorPubkey || typedData.pubkey || ""} role={typedData.role} />
              </div>
            </>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: "#222" }}
        className="w-3 h-3 border border-black right-[-6px]"
      />
    </div>
  );
}
