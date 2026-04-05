"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { SolariumClient } from "@solarium-labs/sdk";
import { ClockCounterClockwise, Robot, Desktop, MapPin } from "@phosphor-icons/react";

export default function HistoryPage() {
  const t = useTranslations("DashboardHistory");
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicKey) {
      setTasks([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadHistory() {
      try {
        const provider = new AnchorProvider(connection, { publicKey } as unknown as Wallet, {
          commitment: "confirmed",
        });
        const client = new SolariumClient(provider);
        const allTasks = await client.program.account.taskState.all();

        const userTasks = allTasks.filter(
          (task: any) => task.account.creator.equals(publicKey) || task.account.assignedWorker.equals(publicKey)
        );
        userTasks.sort((a, b) => b.account.taskId.toNumber() - a.account.taskId.toNumber());

        if (isMounted) {
          setTasks(userTasks);
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to fetch history", e);
        if (isMounted) setLoading(false);
      }
    }

    loadHistory();
    const interval = setInterval(loadHistory, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [publicKey, connection]);

  const getStatusText = (status: any) => {
    if (status.finalized !== undefined) return "FINALIZED";
    if (status.optimisticFinalized !== undefined) return "FINALIZED (OPT)";
    if (status.revealing !== undefined) return "REVEALING";
    if (status.slashed !== undefined) return "SLASHED";
    if (status.cancelled !== undefined) return "CANCELLED";
    if (status.claimed !== undefined) return "CLAIMED";
    return "OPEN";
  };

  const getStatusColor = (status: any) => {
    if (status.finalized !== undefined || status.optimisticFinalized !== undefined) return "text-[#10D9B0]";
    if (status.slashed !== undefined || status.cancelled !== undefined) return "text-[#F43F5E]";
    return "text-[#F39C12]";
  };

  return (
    <div className="w-full flex-col animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2 mb-8 border-b border-white/5 pb-8">
        <h1 className="text-3xl font-exo2 font-semibold text-white tracking-tight">{t("title")}</h1>
        <span className="text-[#777] font-onest">{t("description")}</span>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl flex flex-col overflow-hidden relative">
        <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <ClockCounterClockwise weight="bold" className="text-[#777] size-5" />
            <h2 className="font-exo2 text-lg font-bold text-white">On-chain Ledger</h2>
          </div>
        </div>

        <div className="min-h-[400px]">
          {loading && tasks.length === 0 ? (
            <div className="w-full h-[400px] flex items-center justify-center text-[#555] font-mono text-sm animate-pulse">
              Syncing with Solana Localnet...
            </div>
          ) : tasks.length === 0 ? (
            <div className="w-full h-[400px] flex flex-col items-center justify-center text-[#555]">
              <MapPin weight="thin" className="size-12 opacity-20 mb-3" />
              <span className="font-mono text-xs tracking-widest uppercase">{t("empty")}</span>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {tasks.map((task) => {
                const isCreator = task.account.creator.equals(publicKey);
                const isFinalized =
                  task.account.status.finalized !== undefined || task.account.status.optimisticFinalized !== undefined;

                return (
                  <div
                    key={task.publicKey.toString()}
                    className="flex p-6 items-start gap-6 hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="p-3 bg-white/5 rounded-full shrink-0 group-hover:bg-white/10 transition-colors">
                      <Robot weight="fill" className="text-white size-6" />
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-exo2 text-lg text-white font-semibold flex items-center gap-2">
                            Task ID #{task.account.taskId.toString()}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-widest bg-white/5 ${getStatusColor(task.account.status)}`}
                            >
                              {getStatusText(task.account.status)}
                            </span>
                          </h3>
                          <span className="text-[#777] font-mono text-xs mt-1 block">
                            Created at {new Date(task.account.createdAt.toNumber() * 1000).toLocaleString()}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-exo2 font-semibold text-white block">
                            {(task.account.reward.toNumber() / 1e9).toFixed(2)} SOL
                          </span>
                          <span className="text-xs font-mono text-[#555] uppercase tracking-wider">
                            {isCreator ? "SPENT" : "EARNED (IF SOLVED)"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-8 p-4 bg-[#050505] rounded-xl border border-white/5 text-sm font-mono text-[#A3A3A3]">
                        <div className="flex flex-col gap-1">
                          <span className="text-[#555] text-[10px] uppercase">My Role</span>
                          <span className={isCreator ? "text-[#38BDF8]" : "text-[#10D9B0]"}>
                            {isCreator ? "Creator / DApp" : "Worker / Validator"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[#555] text-[10px] uppercase">Task Type</span>
                          <span className="text-white">{Object.keys(task.account.taskType)[0]}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[#555] text-[10px] uppercase">Assigned Machine</span>
                          <span>{task.account.assignedWorker.toString().substring(0, 8)}...</span>
                        </div>
                        {isFinalized && (
                          <div className="flex flex-col gap-1">
                            <span className="text-[#555] text-[10px] uppercase">Verdict</span>
                            <span className="text-white font-bold">{Object.keys(task.account.finalVerdict)[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
