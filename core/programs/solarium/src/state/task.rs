use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum TaskType {
    Analyze,
    Simulate,
    Classify,
    Generate,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum TaskStatus {
    Open,
    Claimed,
    Committed,
    Revealing,
    OptimisticFinalized,
    Challenged,
    Resolved,
    Finalized,
    Cancelled,
    Invalidated,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum Verdict {
    None,
    Approved,
    Suspicious,
    Rejected,
    Error,
}

impl Verdict {
    pub fn from_byte(b: u8) -> Self {
        match b {
            1 => Verdict::Approved,
            2 => Verdict::Suspicious,
            3 => Verdict::Rejected,
            4 => Verdict::Error,
            _ => Verdict::None,
        }
    }
}

#[account]
pub struct TaskState {
    pub task_id: u64,
    pub creator: Pubkey,
    pub input_hash: [u8; 32],
    pub task_type: TaskType,
    pub tier: u8,
    pub reward: u64,
    pub validator_count: u8,
    pub status: TaskStatus,
    pub assigned_worker: Pubkey,
    pub final_verdict: Verdict,
    pub final_confidence: u8,
    pub commit_deadline: i64,
    pub reveal_deadline: i64,
    pub commits_received: u8,
    pub reveals_received: u8,
    pub created_at: i64,
    pub optimistic_finality_timestamp: i64,
    pub bump: u8,
}
