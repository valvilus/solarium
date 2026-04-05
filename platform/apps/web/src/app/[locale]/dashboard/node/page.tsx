"use client";

import { useTranslations } from "next-intl";
import { HardDrives, ShieldCheck, Coins, Database, Cpu, Medal, HandWithdraw } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { LiveTerminal } from "@/components/dashboard/node/LiveTerminal";
import { toast } from "sonner";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Wallet, BN } from "@coral-xyz/anchor";
import { SolariumClient, deriveNodePda } from "@solarium-labs/sdk";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function NodeOperatorHub() {
  const t = useTranslations("DashboardNode");
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const [nodeState, setNodeState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [workerStake, setWorkerStake] = useState("");
  const [validatorStake, setValidatorStake] = useState("");

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [pendingDepositAmount, setPendingDepositAmount] = useState<string>("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const fetchNodeState = async () => {
    if (!publicKey) {
      setNodeState(null);
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    try {
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
      const [nodePda] = deriveNodePda(publicKey, client.programId);
      const state = await client.program.account.nodeState.fetch(nodePda);
      if (isMounted) setNodeState(state);
    } catch {
      if (isMounted) setNodeState(null);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNodeState();
    const interval = setInterval(fetchNodeState, 10000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  const handleDepositRequest = (amountStr: string) => {
    if (!amountStr || parseFloat(amountStr) <= 0) {
      toast.error(t("invalidAmount"));
      return;
    }
    setPendingDepositAmount(amountStr);
    setIsDepositModalOpen(true);
  };

  const handleDepositExecute = async () => {
    if (!publicKey) return;

    try {
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

      const parsedAmount = new Number(pendingDepositAmount).valueOf();

      if (!nodeState) {
        toast.info("Please complete registration by deploying a node first.");
        return;
      }

      const sig = await client.depositStake(new BN(parsedAmount * LAMPORTS_PER_SOL));
      toast.success(`${t("depositSuccess")} Tx: ${sig.substring(0, 8)}...`);
      fetchNodeState();
      setWorkerStake("");
      setValidatorStake("");
    } catch (e: any) {
      let emsg = e.message || "";
      if (emsg.includes("0x1")) emsg = "Insufficient SOL in wallet (0x1)";
      toast.error(`${t("depositError")}: ${emsg.split("Logs")[0]}`);
      console.error(e);
    }
  };

  const handleWithdrawExecute = async () => {
    if (!publicKey || !nodeState) return;

    try {
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

      const sig = await client.requestWithdrawal(new BN(nodeState.freeStake.toString()));
      toast.success(`Withdrawal requested successfully! Tx: ${sig.substring(0, 8)}`);
      fetchNodeState();
    } catch (e: any) {
      const emsg = e.message || "Active tasks must be completed.";
      toast.error(`Failed to request withdrawal: ${emsg.split("Logs")[0]}`);
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex-col animate-in fade-in duration-500 pb-20 opacity-50">
        <div className="h-64 bg-white/5 animate-pulse rounded-2xl" />
      </div>
    );
  }

  const activeRole = nodeState ? (nodeState.nodeType?.worker !== undefined ? "worker" : "validator") : null;
  const isUnbonding = nodeState && nodeState.withdrawalAmount && nodeState.withdrawalAmount.toNumber() > 0;

  return (
    <div className="w-full flex-col animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-exo2 font-semibold text-white tracking-tight">{t("title")}</h1>
        <span className="text-[#777] font-onest">{t("description")}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4895EF]/5 blur-3xl rounded-full group-hover:bg-[#4895EF]/10 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-onest text-sm text-[#777]">{t("totalStaked")}</span>
            <Database weight="fill" className="text-[#555] size-5" />
          </div>
          <div className="relative z-10 flex justify-between items-end">
            <h3 className="font-exo2 text-[1.5rem] font-bold text-white">
              {nodeState
                ? ((nodeState.freeStake.toNumber() + nodeState.lockedStake.toNumber()) / LAMPORTS_PER_SOL).toFixed(2)
                : "0.00"}{" "}
              SOL
            </h3>
            {nodeState && nodeState.freeStake.toNumber() > 0 && (
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded flex items-center gap-1 text-[10px] text-[#A3A3A3] font-mono transition-colors border border-white/5"
              >
                <HandWithdraw weight="regular" /> WITHDRAW
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2E8F0]/5 blur-3xl rounded-full group-hover:bg-[#E2E8F0]/10 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-onest text-sm text-[#777]">{t("tasksCompleted")}</span>
            <Cpu weight="fill" className="text-[#555] size-5" />
          </div>
          <h3 className="font-exo2 text-[1.5rem] font-bold text-white relative z-10">
            {nodeState ? nodeState.tasksCompleted : 0}
          </h3>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10D9B0]/5 blur-3xl rounded-full group-hover:bg-[#10D9B0]/10 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-onest text-sm text-[#777]">{t("pendingRewards")}</span>
            <Coins weight="fill" className="text-[#10D9B0] size-5" />
          </div>
          <h3 className="font-exo2 text-[1.5rem] font-bold text-[#10D9B0] relative z-10">
            +{nodeState ? +(nodeState.pendingRewards.toNumber() / LAMPORTS_PER_SOL).toFixed(4) : "0.0000"}
          </h3>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F39C12]/5 blur-3xl rounded-full group-hover:bg-[#F39C12]/10 transition-colors" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-onest text-sm text-[#777]">{t("reputationScore")}</span>
            <Medal weight="fill" className="text-[#F39C12] size-5" />
          </div>
          <h3 className="font-exo2 text-[1.5rem] font-bold text-white relative z-10">
            {nodeState ? nodeState.reputation : 0}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className={`flex flex-col gap-4 transition-all duration-300 ${activeRole === "validator" ? "opacity-30 pointer-events-none grayscale" : ""}`}
        >
          <LiveTerminal
            isStaked={nodeState && nodeState.freeStake.toNumber() + nodeState.lockedStake.toNumber() > 0}
            isRegistered={!!nodeState}
            selectedRole="worker"
            isLocked={activeRole === "validator"}
            isUnbonding={isUnbonding}
          />

          <div
            className={`bg-[#0A0A0A] border border-[#10D9B0]/20 rounded-2xl p-5 shadow-[0_0_30px_rgba(16,217,176,0.03)] flex flex-col gap-4 ${activeRole === "validator" ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#10D9B0]/10 rounded-xl">
                <HardDrives weight="fill" className="text-[#10D9B0] size-6" />
              </div>
              <div>
                <h3 className="font-exo2 text-white font-semibold">{t("roleWorker")}</h3>
                <span className="font-mono text-xs text-[#10D9B0]">{t("minStake", { amount: "1.0" })}</span>
              </div>
            </div>
            <p className="text-[#777] text-sm leading-relaxed font-onest">{t("stakeDesc")}</p>

            <div className="flex gap-2 mt-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="0.00"
                  value={workerStake}
                  onChange={(e) => setWorkerStake(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 font-mono text-white text-base focus:outline-none focus:border-[#10D9B0] transition-colors"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] font-mono font-bold text-sm">
                  SOL
                </div>
              </div>
              <button
                onClick={() => handleDepositRequest(workerStake)}
                className="px-6 rounded-xl bg-white text-black font-onest font-semibold hover:bg-[#E2E8F0] active:scale-95 transition-all text-sm"
              >
                {t("addStake")}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col gap-4 transition-all duration-300 ${activeRole === "worker" ? "opacity-30 pointer-events-none grayscale" : ""}`}
        >
          <LiveTerminal
            isStaked={nodeState && nodeState.freeStake.toNumber() + nodeState.lockedStake.toNumber() > 0}
            isRegistered={!!nodeState}
            selectedRole="validator"
            isLocked={activeRole === "worker"}
            isUnbonding={isUnbonding}
          />

          <div
            className={`bg-[#0A0A0A] border border-[#F39C12]/20 rounded-2xl p-5 shadow-[0_0_30px_rgba(243,156,18,0.03)] flex flex-col gap-4 ${activeRole === "worker" ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F39C12]/10 rounded-xl">
                <ShieldCheck weight="fill" className="text-[#F39C12] size-6" />
              </div>
              <div>
                <h3 className="font-exo2 text-white font-semibold">{t("roleValidator")}</h3>
                <span className="font-mono text-xs text-[#F39C12]">{t("minStake", { amount: "0.5" })}</span>
              </div>
            </div>
            <p className="text-[#777] text-sm leading-relaxed font-onest">{t("stakeDesc")}</p>

            <div className="flex gap-2 mt-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="0.00"
                  value={validatorStake}
                  onChange={(e) => setValidatorStake(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 font-mono text-white text-base focus:outline-none focus:border-[#F39C12] transition-colors"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] font-mono font-bold text-sm">
                  SOL
                </div>
              </div>
              <button
                onClick={() => handleDepositRequest(validatorStake)}
                className="px-6 rounded-xl bg-white text-black font-onest font-semibold hover:bg-[#E2E8F0] active:scale-95 transition-all text-sm"
              >
                {t("addStake")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        onConfirm={handleDepositExecute}
        title={t("confirmDepositTitle")}
        description={t("confirmDepositDesc", { amount: pendingDepositAmount })}
        confirmText={t("confirmDepositBtn")}
        cancelText={t("cancelBtn")}
      />

      <ConfirmModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleWithdrawExecute}
        title={t("withdrawTitle")}
        description={t("withdrawDesc")}
        confirmText={t("withdrawBtn")}
        cancelText={t("keepBondedBtn")}
        isDestructive={true}
      />
    </div>
  );
}
