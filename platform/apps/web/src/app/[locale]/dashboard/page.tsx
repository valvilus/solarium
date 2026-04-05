"use client";

import { useTranslations } from "next-intl";
import {
  Coins,
  HardDrives,
  TrendUp,
  Medal,
  Cpu,
  CalendarBlank,
  CheckCircle,
  ArrowsClockwise,
  WarningOctagon,
  Clock,
  Robot,
  Desktop,
} from "@phosphor-icons/react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useNetwork } from "@/providers/wallet-provider";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { SolariumClient, deriveNodePda } from "@solarium-labs/sdk";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardOverview() {
  const t = useTranslations("DashboardOverview");
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const [balance, setBalance] = useState<number | null>(null);
  const [nodeState, setNodeState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const getStatusComponent = (status: any) => {
    if (status.finalized !== undefined || status.optimisticFinalized !== undefined) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10D9B0]/10 border border-[#10D9B0]/20 text-[#10D9B0] text-[11px] font-mono tracking-widest uppercase">
          <CheckCircle weight="fill" />
          {status.finalized !== undefined ? "Finalized" : "Finalized (Opt)"}
        </span>
      );
    }
    if (status.revealing !== undefined) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0151FC]/10 border border-[#0151FC]/20 text-[#0151FC] text-[11px] font-mono tracking-widest uppercase animate-pulse">
          <ArrowsClockwise weight="regular" className="animate-spin" />
          Revealing
        </span>
      );
    }
    if (status.slashed !== undefined || status.cancelled !== undefined) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FF1515]/10 border border-[#FF1515]/20 text-[#FF1515] text-[11px] font-mono tracking-widest uppercase">
          <WarningOctagon weight="fill" />
          {status.slashed !== undefined ? "Slashed" : "Cancelled"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F39C12]/10 border border-[#F39C12]/20 text-[#F39C12] text-[11px] font-mono tracking-widest uppercase animate-pulse">
        <Clock weight="fill" />
        {status.open !== undefined ? "Open" : status.claimed !== undefined ? "Claimed" : "Pending"}
      </span>
    );
  };

  const getModelName = (taskType: any) => {
    if (taskType.analyze !== undefined) return "Analysis Task";
    if (taskType.simulate !== undefined) return "Simulation";
    if (taskType.classify !== undefined) return "Classification";
    if (taskType.generate !== undefined) return "Generation";
    return "Unknown";
  };

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      setNodeState(null);
      setTasks([]);
      setChartData([]);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        const lamports = await connection.getBalance(publicKey);
        if (isMounted) setBalance(lamports / LAMPORTS_PER_SOL);

        const provider = new AnchorProvider(connection, { publicKey } as unknown as Wallet, {
          commitment: "confirmed",
        });
        const client = new SolariumClient(provider);
        const [nodePda] = deriveNodePda(publicKey, client.programId);

        try {
          const state = await client.program.account.nodeState.fetch(nodePda);
          if (isMounted) setNodeState(state);
        } catch (e) {
          if (isMounted) setNodeState(null);
        }

        const allTasksRaw = await client.program.account.taskState.all();
        const userTasks = allTasksRaw.filter(
          (task: any) => task.account.creator.equals(publicKey) || task.account.assignedWorker.equals(publicKey)
        );
        userTasks.sort((a, b) => b.account.taskId.toNumber() - a.account.taskId.toNumber());

        if (isMounted) {
          setTasks(userTasks);

          const chartBins: Record<string, number> = {};
          const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const label = d.toLocaleDateString("en-US", { weekday: "short" });
            chartBins[label] = 0;
            return label;
          });

          userTasks.forEach((task) => {
            const ts = task.account.createdAt.toNumber() * 1000;
            const date = new Date(ts);
            const label = date.toLocaleDateString("en-US", { weekday: "short" });
            if (chartBins[label] !== undefined) {
              chartBins[label]++;
            }
          });

          setChartData(last7Days.map((name) => ({ name, tasks: chartBins[name] })));
        }

        if (isMounted) setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [publicKey, connection]);

  return (
    <div className="w-full flex-col animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-exo2 font-semibold text-white tracking-tight">{t("overviewTitle")}</h1>
        <span className="text-[#777] font-onest">{t("overviewDesc")}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4895EF]/5 blur-3xl rounded-full group-hover:bg-[#4895EF]/10 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-onest text-sm text-[#777]">{t("walletBalance")}</span>
            <Coins weight="fill" className="text-[#555] size-5" />
          </div>
          <div className="relative z-10">
            <h3 className="font-exo2 text-[1.75rem] font-bold text-white mb-1">
              {loading ? "..." : balance !== null ? `${balance.toFixed(2)}` : "0.00"} SOL
            </h3>
            {balance !== null && balance > 0 ? (
              <span className="text-[12px] font-mono text-[#10D9B0] bg-[#10D9B0]/10 px-2 py-0.5 rounded flex items-center w-fit gap-1">
                <TrendUp weight="bold" /> ACTIVE
              </span>
            ) : (
              <span className="text-[12px] font-mono text-[#555] bg-white/5 px-2 py-0.5 rounded flex items-center w-fit gap-1">
                EMPTY
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10D9B0]/5 blur-3xl rounded-full group-hover:bg-[#10D9B0]/10 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-onest text-sm text-[#777]">{t("operatorTarget")}</span>
            <HardDrives weight="fill" className="text-[#10D9B0] size-5" />
          </div>
          <div className="relative z-10">
            <h3 className="font-exo2 text-[1.75rem] font-bold text-white mb-1">
              {nodeState
                ? ((nodeState.freeStake.toNumber() + nodeState.lockedStake.toNumber()) / LAMPORTS_PER_SOL).toFixed(2)
                : "0.00"}{" "}
              SOL
            </h3>
            <span className="text-[12px] font-mono text-[#555] bg-white/5 px-2 py-0.5 rounded flex items-center w-fit gap-1 mt-1">
              {nodeState ? "ACTIVE STAKE" : "NO ACTIVE STAKE"}
            </span>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2E8F0]/5 blur-3xl rounded-full group-hover:bg-[#E2E8F0]/10 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-onest text-sm text-[#777]">{t("tasksProcessed")}</span>
            <Cpu weight="fill" className="text-[#E2E8F0] size-5" />
          </div>
          <div className="relative z-10">
            <h3 className="font-exo2 text-[1.75rem] font-bold text-white mb-1">
              {nodeState ? nodeState.tasksCompleted : tasks.length > 0 ? tasks.length : "0"}
            </h3>
            <span className="text-[12px] font-mono text-[#555] bg-white/5 px-2 py-0.5 rounded flex items-center w-fit gap-1 mt-1">
              {t("lifetimeTotal")}
            </span>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F39C12]/5 blur-3xl rounded-full group-hover:bg-[#F39C12]/10 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-onest text-sm text-[#777]">{t("protocolReputation")}</span>
            <Medal weight="fill" className="text-[#F39C12] size-5" />
          </div>
          <div className="relative z-10">
            <h3 className="font-exo2 text-[1.75rem] font-bold text-white mb-1">
              {nodeState ? nodeState.reputation : "0"}
            </h3>
            <span className="text-[12px] font-mono text-[#555] bg-white/5 px-2 py-0.5 rounded flex items-center w-fit gap-1 mt-1">
              {nodeState ? "TRUSTED TIER" : "NO RATING"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl mb-8 flex flex-col relative overflow-hidden h-[300px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-exo2 text-white font-semibold">Activity Graph</h3>
          <span className="font-mono text-[10px] text-[#10D9B0] tracking-widest uppercase px-3 py-1 bg-[#10D9B0]/10 rounded-full">
            Active Inferences
          </span>
        </div>

        {tasks.length > 0 ? (
          <div className="flex-1 w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10D9B0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10D9B0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#777", fontSize: 10, fontFamily: "monospace" }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0A0A0A",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#10D9B0", fontWeight: "bold" }}
                  labelStyle={{ color: "#777", fontFamily: "monospace" }}
                />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="#10D9B0"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTasks)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
            <CalendarBlank weight="thin" className="size-12 text-white/10 mb-3" />
            <span className="font-mono text-[#555] text-[11px] tracking-widest uppercase px-4 py-2 rounded-full border border-white/5 bg-white/[0.01]">
              No Inference Data Found
            </span>
          </div>
        )}
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5 flex gap-6">
          <button className="text-sm font-onest font-medium text-white px-3 py-1.5 bg-white/10 rounded-md shadow-sm">
            {t("recentInferences")}
          </button>
        </div>

        {tasks.length > 0 ? (
          <div className="overflow-x-auto min-h-[200px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#050505]">
                  <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-[#555]">Task ID</th>
                  <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-[#555]">Model</th>
                  <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-[#555]">
                    Assigned Worker
                  </th>
                  <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-[#555]">Fee</th>
                  <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-[#555]">State</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task: any) => {
                  const workerKey = task.account.assignedWorker.toString();
                  return (
                    <tr
                      key={task.publicKey.toString()}
                      className="border-b border-white/5 hover:bg-white/[0.04] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-[#E2E8F0] tracking-wider text-sm">
                          Task {task.account.taskId.toString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Robot weight="fill" className="text-[#8BA3C0]" />
                          <span className="font-onest text-sm text-[#A3A3A3]">
                            {getModelName(task.account.taskType)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Desktop
                            weight="fill"
                            className={
                              workerKey !== "11111111111111111111111111111111" ? "text-[#10D9B0]" : "text-[#555]"
                            }
                          />
                          <span className="font-mono text-xs tracking-wider text-[#A3A3A3]">
                            {workerKey === "11111111111111111111111111111111"
                              ? "Unassigned"
                              : workerKey.substring(0, 10) + "..."}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-exo2 font-semibold text-white text-sm">
                          {(task.account.reward.toNumber() / 1e9).toFixed(2)} SOL
                        </span>
                      </td>
                      <td className="px-6 py-4">{getStatusComponent(task.account.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center py-16">
            <span className="font-mono text-[#555] text-[10px] tracking-widest uppercase">
              No active tasks mapped to your keys
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
