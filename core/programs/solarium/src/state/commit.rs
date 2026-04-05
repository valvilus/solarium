use super::node::NodeType;
use super::task::Verdict;
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ValidationVote {
    Unrevealed,
    Agree,
    Disagree,
    Invalid,
}

impl ValidationVote {
    pub fn from_byte(b: u8) -> Self {
        match b {
            1 => ValidationVote::Agree,
            2 => ValidationVote::Disagree,
            3 => ValidationVote::Invalid,
            _ => ValidationVote::Unrevealed,
        }
    }
}

#[account]
pub struct CommitState {
    pub task: Pubkey,
    pub operator: Pubkey,
    pub role: NodeType,
    pub commitment: [u8; 32],
    pub revealed_verdict: Verdict,
    pub revealed_confidence: u8,
    pub validation_vote: ValidationVote,
    pub reasoning_hash: [u8; 32],
    pub trace_hash: [u8; 32],
    pub committed_at: i64,
    pub revealed_at: i64,
    pub bump: u8,
}
