"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { SolariumClient } from "@solarium-labs/sdk";
import { HardDrives, ShieldCheck, Lightning } from "@phosphor-icons/react";

export function NodeRoster() {
  const t = useTranslations("Explorer");
  const { connection } = useConnection();
  const [nodes, setNodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNodes() {
      try {
        const provider = new AnchorProvider(connection, {} as any, { commitment: "confirmed" });
        const client = new SolariumClient(provider);
        const data = await client.program.account.nodeState.all();

        data.sort((a, b) => {
          const stakeA =
            ((a.account as any).freeStake?.toNumber() || 0) +
            ((a.account as any).lockedStake?.toNumber() || 0) +
            ((a.account as any).stake?.toNumber() || 0);
          const stakeB =
            ((b.account as any).freeStake?.toNumber() || 0) +
            ((b.account as any).lockedStake?.toNumber() || 0) +
            ((b.account as any).stake?.toNumber() || 0);
          return stakeB - stakeA;
        });
        setNodes(data);
      } catch (e) {
        console.error("Failed to fetch node roster", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadNodes();
    const interval = setInterval(loadNodes, 15000);
    return () => clearInterval(interval);
  }, [connection]);

  return (
    <div className="bg-[#050505] border border-white/5 rounded-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#4895EF]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HardDrives weight="bold" className="text-white size-5" />
          <h2 className="font-exo2 text-lg font-bold text-white">{t("nodeRoster")}</h2>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-mono text-white">
          <div className="size-2 rounded-full bg-[#10D9B0] animate-pulse" />
          {nodes.length} ONLINE
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-white/5 bg-[#0A0A0A]">
              <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-[#777]">{t("thRole")}</th>
              <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-[#777]">{t("thOperator")}</th>
              <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-[#777]">{t("thStake")}</th>
              <th className="px-6 py-4 text-xs font-mono uppercase tracking-widest text-[#777] text-right">
                Reputation
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {isLoading && nodes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#555] animate-pulse">
                  Loading Subnet...
                </td>
              </tr>
            ) : nodes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#555]">
                  No active bots found
                </td>
              </tr>
            ) : (
              nodes.map((n, i) => {
                const isValidator = n.account.nodeType.validator !== undefined;
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      {isValidator ? (
                        <div className="flex items-center gap-2 text-[#4895EF]">
                          <ShieldCheck weight="fill" className="size-4" />
                          <span className="text-xs uppercase tracking-wider">Validator</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-[#10D9B0]">
                          <Lightning weight="fill" className="size-4" />
                          <span className="text-xs uppercase tracking-wider">Worker</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-white text-sm">{n.account.operator.toString().substring(0, 16)}...</span>
                        <span className="text-[#555] text-xs">
                          Worker: {n.account.delegatedWorker.toString().substring(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const stake =
                          ((n.account as any).freeStake?.toNumber() || 0) +
                          ((n.account as any).lockedStake?.toNumber() || 0) +
                          ((n.account as any).stake?.toNumber() || 0);
                        return <span className="text-white">{(stake / 1e9).toFixed(2)}</span>;
                      })()}
                      <span className="text-[#555] ml-2">SOL</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[#F39C12]">{n.account.reputation.toString()}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
