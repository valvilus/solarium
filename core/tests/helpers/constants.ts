import { BN } from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const WORKER_TYPE = 0;
export const VALIDATOR_TYPE = 1;

export const TIER_LIGHT = 1;
export const TIER_MID = 2;
export const TIER_HEAVY = 3;

export const TASK_TYPE_ANALYZE = 0;

export const VERDICT_APPROVED = 1;
export const VERDICT_SUSPICIOUS = 2;
export const VERDICT_REJECTED = 3;

export const VOTE_AGREE = 1;
export const VOTE_DISAGREE = 2;
export const VOTE_INVALID = 3;

export const WORKER_CONFIDENCE = 90;

export const WORKER_STAKE_LAMPORTS = 1_000_000_000;
export const VALIDATOR_STAKE_LAMPORTS = 500_000_000;

export const WORKER_STAKE = new BN(WORKER_STAKE_LAMPORTS);
export const VALIDATOR_STAKE = new BN(VALIDATOR_STAKE_LAMPORTS);
export const TASK_REWARD = new BN(0.1 * LAMPORTS_PER_SOL);
export const TASK_REWARD_LAMPORTS = 100_000_000;

export const PROTOCOL_FEE_BPS = 500;
export const WORKER_REWARD_BPS = 6_000;
export const VALIDATOR_REWARD_BPS = 4_000;
export const BPS_DENOMINATOR = 10_000;
export const SLASH_WRONG_VERDICT_BPS = 500;
export const SLASH_NO_REVEAL_BPS = 200;

export const AIRDROP_AMOUNT = 10 * LAMPORTS_PER_SOL;

export const EMPTY_HASH: number[] = new Array(32).fill(0);
export const VALIDATOR_COUNT = 2;
