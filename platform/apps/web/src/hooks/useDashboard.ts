"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useSolariumClient } from "./useSolariumClient";

type NodeData = {
  readonly nodeType: object;
  readonly tier: number;
  readonly stake: string;
  readonly reputation: number;
  readonly tasksCompleted: number;
  readonly pendingRewards: string;
};

type DashboardData = {
  readonly balance: string;
  readonly node: NodeData | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly reload: () => void;
};

function lamportsToSol(lamports: number | bigint): string {
  return (Number(lamports) / LAMPORTS_PER_SOL).toFixed(3);
}

export function useDashboard(): DashboardData {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const client = useSolariumClient();
  const [balance, setBalance] = useState("0.000");
  const [node, setNode] = useState<NodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback((): void => {
    setTick((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!publicKey || !client) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async (): Promise<void> => {
      const [bal, nodeData] = await Promise.all([
        connection.getBalance(publicKey),
        client.fetchNode(publicKey).catch(() => null),
      ]);

      if (cancelled) return;

      setBalance(lamportsToSol(bal));
      if (nodeData) {
        setNode({
          nodeType: nodeData.nodeType,
          tier: nodeData.tier,
          stake: lamportsToSol(nodeData.stake),
          reputation: nodeData.reputation,
          tasksCompleted: nodeData.tasksCompleted,
          pendingRewards: lamportsToSol(nodeData.pendingRewards),
        });
      } else {
        setNode(null);
      }
      setLoading(false);
    };

    load().catch((err: unknown) => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [publicKey, client, connection, tick]);

  return { balance, node, loading, error, reload };
}
