import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ChartLineUp, HardDrives, Stack, ClockClockwise } from "@phosphor-icons/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { SolariumClient, NodeType } from "@solarium-labs/sdk";

export function NetworkMetrics() {
  const t = useTranslations("Explorer");
  const { connection } = useConnection();

  const [metrics, setMetrics] = useState({
    activeNodes: 0,
    inferenceVolume: 0,
    totalStake: 0,
  });

  useEffect(() => {
    async function loadMetrics() {
      try {
        const provider = new AnchorProvider(connection, {} as any, { commitment: "confirmed" });
        const client = new SolariumClient(provider);
        const nodes = await client.program.account.nodeState.all();
        const tasks = await client.program.account.taskState.all();

        let stake = 0;
        nodes.forEach((n) => {
          stake +=
            ((n.account as any).freeStake?.toNumber() || 0) +
            ((n.account as any).lockedStake?.toNumber() || 0) +
            ((n.account as any).stake?.toNumber() || 0);
        });

        setMetrics({
          activeNodes: nodes.length,
          inferenceVolume: tasks.length,
          totalStake: stake / 1e9,
        });
      } catch (e) {
        console.error("Failed to fetch network metrics", e);
      }
    }
    loadMetrics();
    const interval = setInterval(loadMetrics, 10000);
    return () => clearInterval(interval);
  }, [connection]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#050505] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <ChartLineUp weight="fill" className="size-16 text-[#10D9B0]" />
        </div>
        <div className="relative z-10 flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#777]">Total Value Locked</span>
          <span className="font-exo2 text-3xl font-bold text-white tracking-tight">
            {metrics.totalStake.toFixed(2)} SOL
          </span>
        </div>
      </div>

      <div className="bg-[#050505] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <HardDrives weight="fill" className="size-16 text-[#4895EF]" />
        </div>
        <div className="relative z-10 flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#777]">{t("activeNodes")}</span>
          <span className="font-exo2 text-3xl font-bold text-white tracking-tight">{metrics.activeNodes}</span>
        </div>
      </div>

      <div className="bg-[#050505] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Stack weight="fill" className="size-16 text-white" />
        </div>
        <div className="relative z-10 flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#777]">{t("inferenceVolume")}</span>
          <span className="font-exo2 text-3xl font-bold text-white tracking-tight">{metrics.inferenceVolume}</span>
        </div>
      </div>

      <div className="bg-[#050505] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <ClockClockwise weight="fill" className="size-16 text-[#F39C12]" />
        </div>
        <div className="relative z-10 flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#777]">{t("globalUptime")}</span>
          <div className="flex items-baseline gap-1">
            <span className="font-exo2 text-3xl font-bold text-white tracking-tight">99.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
