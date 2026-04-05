export const SEED_PROTOCOL = Buffer.from("protocol");
export const SEED_NODE = Buffer.from("node");
export const SEED_TASK = Buffer.from("task");
export const SEED_COMMIT = Buffer.from("commit");

export const MIN_WORKER_STAKE = 1_000_000_000;
export const MIN_VALIDATOR_STAKE = 500_000_000;

export const COMMIT_WINDOW_SECONDS = 60;
export const REVEAL_WINDOW_SECONDS = 60;
export const COOLDOWN_PERIOD_SECONDS = 300;

export const MAX_VALIDATORS_PER_TASK = 5;
export const MIN_VALIDATORS_PER_TASK = 1;

export const INITIAL_REPUTATION = 5_000;
export const MAX_REPUTATION = 10_000;
export const MIN_REPUTATION_FOR_TASKS = 1_000;

export const PROTOCOL_FEE_BPS = 500;
export const WORKER_REWARD_BPS = 8_000;
export const VALIDATOR_REWARD_BPS = 2_000;
export const BPS_DENOMINATOR = 10_000;

export const COMMIT_STATE_SIZE = 189;
export const COMMIT_TASK_OFFSET = 8;
export const COMMIT_OPERATOR_OFFSET = 40;
