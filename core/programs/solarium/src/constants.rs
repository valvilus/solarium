pub const SEED_PROTOCOL: &[u8] = b"protocol";
pub const SEED_NODE: &[u8] = b"node";
pub const SEED_TASK: &[u8] = b"task";
pub const SEED_COMMIT: &[u8] = b"commit";

pub const MIN_WORKER_STAKE: u64 = 1_000_000_000;
pub const MIN_VALIDATOR_STAKE: u64 = 500_000_000;

pub const COMMIT_WINDOW_SECONDS: i64 = 60;
pub const REVEAL_WINDOW_SECONDS: i64 = 60;
pub const COOLDOWN_PERIOD_SECONDS: i64 = 300;
pub const CHALLENGE_WINDOW_SECONDS: i64 = 300;
pub const WITHDRAWAL_COOLDOWN_SECONDS: i64 = 86400;
pub const MIN_CHALLENGE_BOND: u64 = 2_000_000_000;
pub const MAX_VALIDATORS_PER_TASK: u8 = 5;
pub const MIN_VALIDATORS_PER_TASK: u8 = 1;

pub const MAX_REPUTATION: u16 = 10_000;
pub const INITIAL_REPUTATION: u16 = 5_000;
pub const REPUTATION_GAIN_PER_TASK: u16 = 50;
pub const REPUTATION_LOSS_PER_SLASH: u16 = 200;
pub const REPUTATION_LOSS_NO_REVEAL: u16 = 100;
pub const MIN_REPUTATION_FOR_TASKS: u16 = 1_000;

pub const PROTOCOL_FEE_BPS: u16 = 500;
pub const WORKER_REWARD_BPS: u16 = 6_000;
pub const VALIDATOR_REWARD_BPS: u16 = 4_000;
pub const SLASH_WRONG_VERDICT_BPS: u16 = 500;
pub const SLASH_NO_REVEAL_BPS: u16 = 200;
pub const BPS_DENOMINATOR: u64 = 10_000;

pub const PROTOCOL_STATE_SIZE: usize = 8 + 32 + 8 + 8 + 8 + 4 + 4 + 2 + 8 + 8 + 8 + 32 + 1;
pub const NODE_STATE_SIZE: usize = 8 + 32 + 32 + 1 + 1 + 8 + 8 + 8 + 8 + 2 + 4 + 4 + 8 + 8 + 1;
pub const TASK_STATE_SIZE: usize =
    8 + 8 + 32 + 32 + 1 + 1 + 8 + 1 + 1 + 32 + 1 + 1 + 8 + 8 + 1 + 1 + 8 + 8 + 1;
pub const COMMIT_STATE_SIZE: usize = 8 + 32 + 32 + 1 + 32 + 1 + 1 + 1 + 32 + 32 + 8 + 8 + 1;

pub const MIN_TIER: u8 = 1;
pub const MAX_TIER: u8 = 3;
