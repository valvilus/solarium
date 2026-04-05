import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { PublicKey, AccountMeta } from "@solana/web3.js";
import type { Solarium } from "./idl/solarium";
import idlJson from "./idl/solarium.json";
import { COMMIT_STATE_SIZE, COMMIT_OPERATOR_OFFSET, COMMIT_TASK_OFFSET } from "./constants";
import { deriveProtocolPda, deriveNodePda, deriveTaskPda, deriveCommitPda } from "./pda";
import { TimeoutError } from "./types";
import type { CreateTaskParams, CommitParams, CreateTaskResult, VerdictResult } from "./types";

type ValidatorAccount = {
  readonly commitPda: PublicKey;
  readonly operatorKey: PublicKey;
};

export class SolariumClient {
  readonly program: Program<Solarium>;
  private readonly provider: AnchorProvider;

  constructor(provider: AnchorProvider) {
    this.provider = provider;
    this.program = new Program<Solarium>(idlJson as unknown as Solarium, provider);
  }

  get programId(): PublicKey {
    return this.program.programId;
  }

  get walletKey(): PublicKey {
    return this.provider.wallet.publicKey;
  }

  async initializeProtocol(treasury: PublicKey): Promise<string> {
    return this.program.methods.initializeProtocol(treasury).accountsPartial({ authority: this.walletKey }).rpc();
  }

  async registerNode(workerPubkey: PublicKey, nodeType: number, tier: number): Promise<string> {
    return this.program.methods
      .registerNode(workerPubkey, nodeType, tier)
      .accountsPartial({ operator: this.walletKey })
      .rpc();
  }

  async deregisterNode(): Promise<string> {
    return this.program.methods.deregisterNode().accountsPartial({ operator: this.walletKey }).rpc();
  }

  async withdrawStake(): Promise<string> {
    return this.program.methods.withdrawStake().accountsPartial({ operator: this.walletKey }).rpc();
  }

  async depositStake(amount: BN): Promise<string> {
    const [nodePda] = deriveNodePda(this.walletKey, this.programId);
    return this.program.methods
      .depositStake(amount)
      .accountsPartial({ operator: this.walletKey, nodeState: nodePda })
      .rpc();
  }

  async createTask(params: CreateTaskParams): Promise<CreateTaskResult> {
    const [protocolPda] = deriveProtocolPda(this.programId);
    const protocol = await this.program.account.protocolState.fetch(protocolPda);
    const taskId = new BN(protocol.taskCounter);

    const signature = await this.program.methods
      .createTask(taskId, params.inputHash, params.taskType, params.tier, params.reward, params.validatorCount)
      .accountsPartial({ creator: this.walletKey })
      .rpc();

    return { taskId, signature };
  }

  async cancelTask(taskId: BN): Promise<string> {
    const [taskPda] = deriveTaskPda(taskId, this.programId);
    return this.program.methods.cancelTask().accountsPartial({ creator: this.walletKey, task: taskPda }).rpc();
  }

  async claimTask(taskId: BN, operatorPubkey?: PublicKey): Promise<string> {
    const [taskPda] = deriveTaskPda(taskId, this.programId);
    return this.program.methods
      .claimTask()
      .accountsPartial({
        worker: this.walletKey,
        operator: operatorPubkey || this.walletKey,
        task: taskPda,
      })
      .rpc();
  }

  async commitResult(taskId: BN, params: CommitParams, operatorPubkey?: PublicKey): Promise<string> {
    const [taskPda] = deriveTaskPda(taskId, this.programId);
    return this.program.methods
      .commitResult(params.commitment, params.reasoningHash, params.traceHash)
      .accountsPartial({
        worker: this.walletKey,
        operator: operatorPubkey || this.walletKey,
        task: taskPda,
      })
      .rpc();
  }

  async revealResult(
    taskId: BN,
    verdict: number,
    confidence: number,
    salt: number[],
    operatorPubkey?: PublicKey
  ): Promise<string> {
    const [taskPda] = deriveTaskPda(taskId, this.programId);
    return this.program.methods
      .revealResult(verdict, confidence, salt)
      .accountsPartial({
        worker: this.walletKey,
        operator: operatorPubkey || this.walletKey,
        task: taskPda,
      })
      .rpc();
  }

  async finalizeTask(taskId: BN): Promise<string> {
    const [taskPda] = deriveTaskPda(taskId, this.programId);
    const task = await this.program.account.taskState.fetch(taskPda);
    const [protocolPda] = deriveProtocolPda(this.programId);
    const protocol = await this.program.account.protocolState.fetch(protocolPda);

    const workerKey = task.assignedWorker;
    const [workerNodePda] = deriveNodePda(workerKey, this.programId);
    const [workerCommitPda] = deriveCommitPda(taskPda, workerKey, this.programId);

    const validatorAccounts = await this.fetchValidatorCommits(taskPda, workerKey);
    const remaining = this.buildRemainingAccounts(validatorAccounts);

    return this.program.methods
      .finalizeTask()
      .accountsPartial({
        caller: this.walletKey,
        task: taskPda,
        workerNode: workerNodePda,
        workerCommit: workerCommitPda,
        creator: task.creator,
        treasury: protocol.treasury,
      })
      .remainingAccounts(remaining)
      .rpc();
  }

  async requestWithdrawal(amount: BN): Promise<string> {
    return this.program.methods.requestWithdrawal(amount).accountsPartial({ operator: this.walletKey }).rpc();
  }

  async executeWithdrawal(): Promise<string> {
    return this.program.methods.executeWithdrawal().accountsPartial({ operator: this.walletKey }).rpc();
  }

  async claimRewards(): Promise<string> {
    return this.program.methods.claimRewards().accountsPartial({ operator: this.walletKey }).rpc();
  }

  async timeoutTask(taskId: BN): Promise<string> {
    const [taskPda] = deriveTaskPda(taskId, this.programId);
    const task = await this.program.account.taskState.fetch(taskPda);
    const [workerNodePda] = deriveNodePda(task.assignedWorker, this.programId);
    return this.program.methods
      .timeoutTask()
      .accountsPartial({
        caller: this.walletKey,
        task: taskPda,
        workerNode: workerNodePda,
        creator: task.creator,
      })
      .rpc();
  }

  async fetchProtocol(): Promise<Awaited<ReturnType<typeof this.program.account.protocolState.fetch>>> {
    const [pda] = deriveProtocolPda(this.programId);
    return this.program.account.protocolState.fetch(pda);
  }

  async fetchNode(operator: PublicKey): Promise<Awaited<ReturnType<typeof this.program.account.nodeState.fetch>>> {
    const [pda] = deriveNodePda(operator, this.programId);
    return this.program.account.nodeState.fetch(pda);
  }

  async fetchTask(taskId: BN): Promise<Awaited<ReturnType<typeof this.program.account.taskState.fetch>>> {
    const [pda] = deriveTaskPda(taskId, this.programId);
    return this.program.account.taskState.fetch(pda);
  }

  async fetchCommit(
    taskPda: PublicKey,
    operator: PublicKey
  ): Promise<Awaited<ReturnType<typeof this.program.account.commitState.fetch>>> {
    const [commitPda] = deriveCommitPda(taskPda, operator, this.programId);
    return this.program.account.commitState.fetch(commitPda);
  }

  async resolveOptimisticTask(taskId: BN): Promise<string> {
    const [taskPda] = deriveTaskPda(taskId, this.programId);
    const task = await this.program.account.taskState.fetch(taskPda);
    const [protocolPda] = deriveProtocolPda(this.programId);
    const protocol = await this.program.account.protocolState.fetch(protocolPda);
    const [workerNodePda] = deriveNodePda(task.assignedWorker, this.programId);
    const [workerCommitPda] = deriveCommitPda(taskPda, task.assignedWorker, this.programId);
    const validatorAccounts = await this.fetchValidatorCommits(taskPda, task.assignedWorker);
    const remaining = this.buildRemainingAccounts(validatorAccounts);
    return this.program.methods
      .resolveOptimisticTask()
      .accountsPartial({
        caller: this.walletKey,
        task: taskPda,
        workerNode: workerNodePda,
        workerCommit: workerCommitPda,
        creator: task.creator,
        treasury: protocol.treasury,
      })
      .remainingAccounts(remaining)
      .rpc();
  }

  async waitForVerdict(taskId: BN, timeoutMs: number = 60000): Promise<VerdictResult> {
    const startTime = Date.now();
    const pollIntervalMs = 2000;
    const [pda] = deriveTaskPda(taskId, this.programId);

    while (Date.now() - startTime < timeoutMs) {
      const task = await this.program.account.taskState.fetchNullable(pda);

      if (
        task !== null &&
        ("finalized" in task.status ||
          "optimisticFinalized" in task.status ||
          "completed" in task.status ||
          "invalidated" in task.status)
      ) {
        return {
          taskId,
          verdict: task.finalVerdict,
          confidence: Number(task.finalConfidence),
          status: task.status,
          worker: task.assignedWorker,
          finalizedAt: Date.now(),
        };
      }

      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    throw new TimeoutError("Timeout");
  }

  private async fetchValidatorCommits(
    taskPda: PublicKey,
    workerKey: PublicKey
  ): Promise<ReadonlyArray<ValidatorAccount>> {
    const accounts = await this.provider.connection.getProgramAccounts(this.programId, {
      filters: [{ dataSize: COMMIT_STATE_SIZE }, { memcmp: { offset: COMMIT_TASK_OFFSET, bytes: taskPda.toBase58() } }],
    });

    return accounts
      .map((a) => ({
        commitPda: a.pubkey,
        operatorKey: new PublicKey(a.account.data.slice(COMMIT_OPERATOR_OFFSET, COMMIT_OPERATOR_OFFSET + 32)),
      }))
      .filter((v) => !v.operatorKey.equals(workerKey));
  }

  private buildRemainingAccounts(validators: ReadonlyArray<ValidatorAccount>): AccountMeta[] {
    return validators.flatMap((v) => {
      const [nodePda] = deriveNodePda(v.operatorKey, this.programId);
      return [
        { pubkey: nodePda, isSigner: false, isWritable: true },
        { pubkey: v.commitPda, isSigner: false, isWritable: false },
      ];
    });
  }
}
