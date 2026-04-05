"use client";

import { useState, useEffect } from "react";
import { BN } from "@coral-xyz/anchor";
import { useSolariumClient } from "./useSolariumClient";

type TaskRow = {
  readonly taskId: string;
  readonly taskType: object;
  readonly tier: number;
  readonly reward: string;
  readonly status: object;
  readonly finalVerdict: object;
  readonly finalConfidence: number;
  readonly createdAt: string;
};

type ExplorerData = {
  readonly tasks: ReadonlyArray<TaskRow>;
  readonly loading: boolean;
  readonly error: string | null;
};

function formatSol(lamports: BN): string {
  return (lamports.toNumber() / 1_000_000_000).toFixed(3);
}

function formatDate(timestamp: BN): string {
  const ms = timestamp.toNumber() * 1000;
  if (ms === 0) return "—";
  return new Date(ms).toLocaleTimeString();
}

export function useExplorer(): ExplorerData {
  const client = useSolariumClient();
  const [tasks, setTasks] = useState<ReadonlyArray<TaskRow>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!client) return;

    let cancelled = false;
    setLoading(true);

    const load = async (): Promise<void> => {
      const all = await client.program.account.taskState.all();

      if (cancelled) return;

      const rows: TaskRow[] = all
        .sort((a, b) => b.account.taskId.cmp(a.account.taskId))
        .slice(0, 50)
        .map((entry) => ({
          taskId: entry.account.taskId.toString(),
          taskType: entry.account.taskType,
          tier: entry.account.tier,
          reward: formatSol(entry.account.reward),
          status: entry.account.status,
          finalVerdict: entry.account.finalVerdict,
          finalConfidence: entry.account.finalConfidence,
          createdAt: formatDate(entry.account.createdAt),
        }));

      setTasks(rows);
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
  }, [client]);

  return { tasks, loading, error };
}
