"use client";

import { useTranslations } from "next-intl";
import { TerminalWindow, Power, Play, StopCircle, WarningCircle } from "@phosphor-icons/react";
import { useState, useEffect, useRef } from "react";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { SolariumClient, NodeType } from "@solarium-labs/sdk";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

type NodeState = "idle" | "deploying" | "running";

interface TerminalProps {
  isStaked: boolean;
  isRegistered?: boolean;
  selectedRole: "worker" | "validator";
  isLocked?: boolean;
  isUnbonding?: boolean;
}

export function LiveTerminal({ isStaked, isRegistered, selectedRole, isLocked, isUnbonding }: TerminalProps) {
  const t = useTranslations("DashboardNode");
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const [nodeState, setNodeState] = useState<NodeState>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!publicKey) return;
    fetch(`/api/nodes/status?pubkey=${publicKey.toString()}&role=${selectedRole}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "running") {
          setNodeState("running");
          startLogStream(publicKey.toString(), selectedRole);
        }
      })
      .catch(() => {});
  }, [publicKey, selectedRole]);

  const handleDeploy = async () => {
    if (isLocked || isUnbonding) return;

    if (!publicKey) {
      toast.error(t("missingKey"));
      return;
    }

    const apiKey = localStorage.getItem("solarium_gemini_key");
    if (!apiKey) {
      toast.error(t("missingKey"));
      return;
    }

    const storageKey = `solarium_burner_${publicKey.toString()}_${selectedRole}`;
    let burnerSecret = localStorage.getItem(storageKey);
    let generatedBurnerPubkey = "";

    if (!burnerSecret) {
      const keypair = Keypair.generate();
      burnerSecret = bs58.encode(keypair.secretKey);
      generatedBurnerPubkey = keypair.publicKey.toString();
      localStorage.setItem(storageKey, burnerSecret);
    } else {
      const keypair = Keypair.fromSecretKey(bs58.decode(burnerSecret));
      generatedBurnerPubkey = keypair.publicKey.toString();
    }

    setNodeState("deploying");
    setLogs((prev) => [...prev, `[SYSTEM] ${t("fetchingLogs")}`]);

    try {
      const response = await fetch("/api/nodes/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pubkey: publicKey.toString(),
          apiKey,
          burnerSecret: burnerSecret as string,
          role: selectedRole,
        }),
      });

      if (!response.ok) {
        throw new Error("API failed to spawn container.");
      }

      const data = await response.json();
      const burnerPubkey = data.burnerPubkey;

      if (burnerPubkey) {
        setLogs((prev) => [...prev, `[SYSTEM] Received Burner Key: ${burnerPubkey}. Proceeding...`]);

        if (!isRegistered) {
          const provider = new AnchorProvider(
            connection,
            {
              publicKey,
              signTransaction,
              signAllTransactions,
            } as unknown as Wallet,
            { commitment: "confirmed" }
          );

          const client = new SolariumClient(provider);
          const nodeType = selectedRole === "worker" ? NodeType.Worker : NodeType.Validator;

          try {
            const sig = await client.registerNode(new PublicKey(burnerPubkey), nodeType, 1);
            setLogs((prev) => [...prev, `[SYSTEM] Registration Tx: ${sig.substring(0, 8)}...`]);
            toast.success("Node successfully registered on-chain!");
          } catch (chainErr: unknown) {
            console.error(chainErr);
            toast.error("Failed to register node on-chain.");
          }
        }
      }

      setNodeState("running");
      startLogStream(publicKey.toString(), selectedRole);
    } catch (err) {
      toast.error(t("startError"));
      setNodeState("idle");
      setLogs((prev) => [...prev, `[ERROR] Node deployment failed.`]);
    }
  };

  const handleStop = async () => {
    if (!publicKey || isLocked) return;

    setLogs((prev) => [...prev, `[SYSTEM] Sending termination signal...`]);

    try {
      await fetch("/api/nodes/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pubkey: publicKey.toString(), role: selectedRole }),
      });

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      setNodeState("idle");
      toast.success(t("btnStop"));
    } catch (err) {
      toast.error("Failed to stop node.");
    }
  };

  const startLogStream = (pubkeyString: string, role: string) => {
    setLogs((prev) => [...prev, `[SYSTEM] ${t("connected")}`]);

    const es = new EventSource(`/api/nodes/logs?pubkey=${pubkeyString}&role=${role}`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLogs((prev) => {
          const newLogs = [...prev, data.text];

          if (newLogs.length > 100) return newLogs.slice(newLogs.length - 100);
          return newLogs;
        });
      } catch (e) {
        setLogs((prev) => [...prev, event.data]);
      }
    };

    es.onerror = () => {
      setLogs((prev) => [...prev, `[SYSTEM] Stream interrupted or container stopped.`]);
      es.close();
      setNodeState("idle");
    };
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl flex flex-col overflow-hidden relative group shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(16,217,176,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between gap-6 z-10 w-full">
        <div className="flex items-center gap-3">
          <TerminalWindow weight="fill" className="text-[#10D9B0] size-5" />
          <div>
            <h2 className="font-exo2 text-lg font-semibold text-white">{t("pairingTitle")}</h2>
            <p className="text-[#777] text-sm mt-0.5">{t("pairingDesc")}</p>
          </div>
        </div>

        <div className="flex items-center flex-shrink-0">
          {nodeState === "running" && (
            <span className="flex items-center gap-2.5 text-xs font-mono text-[#10D9B0] bg-[#10D9B0]/10 px-3 py-1.5 rounded-full border border-[#10D9B0]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10D9B0] shadow-[0_0_8px_#10D9B0] animate-pulse shrink-0" />
              <span className="font-semibold tracking-wider">ONLINE</span>
            </span>
          )}
          {nodeState === "deploying" && (
            <span className="flex items-center gap-2.5 text-xs font-mono text-[#F39C12] bg-[#F39C12]/10 px-3 py-1.5 rounded-full border border-[#F39C12]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F39C12] animate-pulse shrink-0" />
              <span className="font-semibold tracking-wider">STARTING</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 bg-[#020202] relative z-10">
        {nodeState === "idle" && logs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#10D9B0]/5 border border-[#10D9B0]/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,217,176,0.05)]">
              <Power weight="regular" className="text-[#10D9B0] size-8" />
            </div>
            <p className="text-[#A3A3A3] font-onest text-sm max-w-[280px] mb-6">{t("pairingInstructions")}</p>
            <button
              onClick={handleDeploy}
              disabled={isLocked || isUnbonding}
              className={`px-6 py-3 rounded-xl font-semibold font-onest text-sm transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(16,217,176,0.2)] ${
                !isLocked && !isUnbonding
                  ? "bg-[#10D9B0] text-black hover:bg-[#10D9B0]/90"
                  : "bg-[#10D9B0]/20 text-[#10D9B0]/40 border border-[#10D9B0]/20 cursor-not-allowed"
              }`}
            >
              <Play weight="fill" className="size-4" />
              {isLocked
                ? "LOCKED TO OTHER ROLE"
                : isUnbonding
                  ? "UNBONDING (FUNDS LOCKED)"
                  : !isRegistered
                    ? "REGISTER NODE"
                    : t(selectedRole === "worker" ? "btnDeployWT" : "btnDeployVT")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col rounded-xl overflow-hidden border border-white/5 bg-black w-full shadow-inner">
            <div
              ref={scrollRef}
              className="h-[280px] p-4 overflow-y-auto font-mono text-[11px] md:text-xs tracking-wide space-y-1 block scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${log.includes("[SYSTEM]") ? "text-[#777]" : log.includes("[ERROR]") ? "text-[#FF1515]" : "text-[#10D9B0]"}`}
                >
                  <span className="opacity-40">❯</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 p-3 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-2 text-[10px] text-[#777] font-mono">
                <WarningCircle weight="bold" />
                <span>DOCKER ENGINE CONNECTED</span>
              </div>

              {nodeState === "running" ? (
                <button
                  onClick={() => setIsStopModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#FF1515]/10 text-[#FF1515] border border-[#FF1515]/20 font-onest text-xs font-semibold hover:bg-[#FF1515] hover:text-white transition-colors flex items-center gap-1"
                >
                  <StopCircle weight="fill" />
                  {t("btnStop")}
                </button>
              ) : (
                nodeState === "idle" && (
                  <button
                    onClick={handleDeploy}
                    className="px-3 py-1.5 rounded-lg bg-[#10D9B0]/10 text-[#10D9B0] border border-[#10D9B0]/20 font-onest text-xs font-semibold hover:bg-[#10D9B0] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Play weight="fill" />
                    RESTART
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        onConfirm={handleStop}
        title={t("confirmStopTitle") || "Stop Daemon Process"}
        description={t("confirmStopDesc") || "Are you sure you want to kill the Docker container?"}
        confirmText={t("confirmStopBtn") || "Stop Process"}
        cancelText={t("cancelBtn") || "Cancel"}
        isDestructive={true}
      />
    </div>
  );
}
