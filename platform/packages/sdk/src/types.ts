import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import type { IdlAccounts } from "@coral-xyz/anchor";
import type { Solarium } from "./idl/solarium";

export const NodeType = {
  Worker: 0,
  Validator: 1,
} as const;

export type NodeTypeValue = (typeof NodeType)[keyof typeof NodeType];

export const TaskType = {
  Analyze: 0,
  Simulate: 1,
  Classify: 2,
  Generate: 3,
} as const;

export type TaskTypeValue = (typeof TaskType)[keyof typeof TaskType];

export const Verdict = {
  None: 0,
  Approved: 1,
  Suspicious: 2,
  Rejected: 3,
  Error: 4,
} as const;

export type VerdictValue = (typeof Verdict)[keyof typeof Verdict];

export const ValidationVote = {
  Unrevealed: 0,
  Agree: 1,
  Disagree: 2,
  Invalid: 3,
} as const;

export type ValidationVoteValue = (typeof ValidationVote)[keyof typeof ValidationVote];

export type CreateTaskParams = {
  readonly inputHash: number[];
  readonly taskType: number;
  readonly tier: number;
  readonly reward: BN;
  readonly validatorCount: number;
};

export type CommitParams = {
  readonly commitment: number[];
  readonly reasoningHash: number[];
  readonly traceHash: number[];
};

export type CreateTaskResult = {
  readonly taskId: BN;
  readonly signature: string;
};

export type TaskAccountData = IdlAccounts<Solarium>["taskState"];

export type VerdictResult = {
  readonly taskId: BN;
  readonly verdict: TaskAccountData["finalVerdict"];
  readonly confidence: number;
  readonly status: TaskAccountData["status"];
  readonly worker: PublicKey;
  readonly finalizedAt: number;
};

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}
