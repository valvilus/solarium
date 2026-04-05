"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, Clock, WarningOctagon, Robot, Desktop, ArrowsClockwise, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { SolariumClient, TaskType, TaskTypeValue, deriveCommitPda } from "@solarium-labs/sdk";

export function LiveTaskFeed() {
  const t = useTranslations("Explorer");
  const { connection } = useConnection();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const getExplorerUrl = (pubkey: string) =>
    `https://explorer.solana.com/address/${pubkey}?cluster=custom&customUrl=http%3A%2F%2F127.0.0.1%3A8899`;

  useEffect(() => {
    async function loadTasks() {
      try {
        const provider = new AnchorProvider(connection, {} as any, { commitment: "confirmed" });
        const client = new SolariumClient(provider);
        const data = await client.program.account.taskState.all();

        data.sort((a, b) => b.account.taskId.toNumber() - a.account.taskId.toNumber());
        setTasks(data);
      } catch (e) {
        console.error("Failed to fetch tasks", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadTasks();
    const interval = setInterval(loadTasks, 8000);
    return () => clearInterval(interval);
  }, [connection]);

  useEffect(() => {
    async function loadReport() {
      if (
        !selectedTask ||
        (selectedTask.account.status.finalized === undefined &&
          selectedTask.account.status.optimisticFinalized === undefined)
      ) {
        setAiReport(null);
        return;
      }
      setReportLoading(true);
      try {
        const provider = new AnchorProvider(connection, {} as any, { commitment: "confirmed" });
        const client = new SolariumClient(provider);

        const [commitPda] = deriveCommitPda(
          selectedTask.publicKey,
          selectedTask.account.assignedWorker,
          client.programId
        );
        const commitState = await client.program.account.commitState.fetch(commitPda);
        const hashHex = toHexString(commitState.reasoningHash);

        const res = await fetch(`/api/storage/${hashHex}`);
        if (res.ok) {
          const json = await res.json();
          setAiReport(json);
        }
      } catch (e) {
        console.error("Failed to load generic report", e);
      } finally {
        setReportLoading(false);
      }
    }
    loadReport();
  }, [selectedTask, connection]);

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
          {status.slashed !== undefined ? t("statusSlashed") : "Cancelled"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F39C12]/10 border border-[#F39C12]/20 text-[#F39C12] text-[11px] font-mono tracking-widest uppercase animate-pulse">
        <Clock weight="fill" />
        {status.open !== undefined ? "Open" : status.claimed !== undefined ? "Claimed" : t("statusPending")}
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

  const toHexString = (buffer: Buffer | Uint8Array | number[]) => {
    return Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  return (
    <div className="bg-[#050505] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <h2 className="font-exo2 text-lg font-semibold text-white flex items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10D9B0] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10D9B0]"></span>
          </div>
          {t("tableTitle")}
        </h2>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-[#050505]">
              <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-[#555]">
                {t("colTaskId")}
              </th>
              <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-[#555]">{t("colModel")}</th>
              <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-[#555]">
                {t("colWorker")}
              </th>
              <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-[#555]">{t("colFee")}</th>
              <th className="px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-[#555]">
                {t("colStatus")}
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#555] animate-pulse">
                  Fetching global network tasks...
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#555]">
                  No tasks active right now. Boot up a bot to test!
                </td>
              </tr>
            ) : (
              tasks.map((task: any) => {
                const workerKey = task.account.assignedWorker.toString();
                return (
                  <tr
                    key={task.publicKey.toString()}
                    onClick={() => setSelectedTask(task)}
                    className="border-b border-white/5 hover:bg-white/[0.04] transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[#E2E8F0] tracking-wider text-sm cursor-pointer hover:text-white transition-colors">
                          Task {task.account.taskId.toString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Robot weight="fill" className="text-[#8BA3C0]" />
                        <span className="font-onest text-sm text-[#A3A3A3]">{getModelName(task.account.taskType)}</span>
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
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-24 pb-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 flex-shrink-0 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-white font-exo2 font-semibold flex items-center gap-2">
                <Robot weight="fill" className="text-[#10D9B0]" />
                Task {selectedTask.account.taskId.toString()} Details
              </h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-[#888] hover:text-white transition-colors p-1"
              >
                <X weight="bold" size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 w-full overflow-y-auto">
              <div className="flex flex-col flex-shrink-0 md:flex-row justify-between gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-[#555] font-mono tracking-widest">Status</span>
                  <div>{getStatusComponent(selectedTask.account.status)}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-[#555] font-mono tracking-widest">Reward</span>
                  <span className="font-exo2 text-white font-semibold">
                    {(selectedTask.account.reward.toNumber() / 1e9).toFixed(2)} SOL
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase text-[#555] font-mono tracking-widest">Model</span>
                  <span className="font-onest text-white">{getModelName(selectedTask.account.taskType)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-onest text-[#A3A3A3]">Blockchain State</h4>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#050505] border border-white/5">
                    <span className="text-[10px] uppercase text-[#555] font-mono tracking-wider">
                      Assigned Worker Node
                    </span>
                    <span className="font-mono text-sm text-[#10D9B0]">
                      {selectedTask.account.assignedWorker.toString() === "11111111111111111111111111111111"
                        ? "Waiting in mempool..."
                        : selectedTask.account.assignedWorker.toString()}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#050505] border border-white/5">
                    <span className="text-[10px] uppercase text-[#555] font-mono tracking-wider">
                      Input Hash (IPFS Payload)
                    </span>
                    <span className="font-mono text-xs text-[#8BA3C0] break-all">
                      0x{toHexString(selectedTask.account.inputHash)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#050505] border border-white/5">
                    <span className="text-[10px] uppercase text-[#555] font-mono tracking-wider">
                      Signatures Received
                    </span>
                    <span className="font-mono text-sm text-white">
                      {selectedTask.account.revealsReceived.toString()} / {selectedTask.account.validatorCount + 1}{" "}
                      (Required Consensus)
                    </span>
                  </div>

                  {(selectedTask.account.status.finalized !== undefined ||
                    selectedTask.account.status.optimisticFinalized !== undefined) && (
                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#050505] border border-white/5">
                      <span className="text-[10px] uppercase text-[#555] font-mono tracking-wider">
                        Final AI Verdict
                      </span>
                      <span className="font-mono text-sm text-white font-bold">
                        Enum Variant: {JSON.stringify(selectedTask.account.finalVerdict) || "N/A"} (Confidence:{" "}
                        {selectedTask.account.finalConfidence?.toString() || 0}%)
                      </span>
                    </div>
                  )}

                  {(selectedTask.account.status.finalized !== undefined ||
                    selectedTask.account.status.optimisticFinalized !== undefined) && (
                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-[#10D9B0]/10 border border-[#10D9B0]/20">
                      <span className="text-[10px] uppercase text-[#10D9B0] font-mono tracking-wider">
                        Consensus Finalized
                      </span>
                      <span className="font-onest text-sm text-[#10D9B0] opacity-80">
                        Task completed successfully. Worker and Validator rewards distributed. Output available on
                        decentralized storage.
                      </span>
                    </div>
                  )}

                  {(selectedTask.account.status.finalized !== undefined ||
                    selectedTask.account.status.optimisticFinalized !== undefined) && (
                    <div className="flex flex-col gap-2 p-3 mt-2 rounded-lg bg-[#050505] border border-white/5">
                      <span className="text-[10px] uppercase text-[#8BA3C0] font-mono tracking-wider">
                        Storage Output (Worker Report)
                      </span>
                      {reportLoading ? (
                        <span className="animate-pulse text-xs text-[#555]">Decrypting from Storage...</span>
                      ) : aiReport ? (
                        <div className="p-3 bg-white/[0.02] rounded-md font-mono text-xs text-[#E2E8F0] whitespace-pre-wrap max-h-64 overflow-y-auto">
                          {aiReport.output && typeof aiReport.output.reasoning === "string"
                            ? aiReport.output.reasoning
                            : JSON.stringify(aiReport.output || aiReport, null, 2)}
                        </div>
                      ) : (
                        <span className="text-xs text-[#555]">Report unavailable or pruned from local disk.</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 flex-shrink-0 bg-white/[0.02] border-t border-white/10 flex justify-end">
              <a
                href={getExplorerUrl(selectedTask.publicKey.toString())}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-[#F39C12] hover:underline"
              >
                View state on Solscan ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
