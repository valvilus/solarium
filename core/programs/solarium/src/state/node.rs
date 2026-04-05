use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum NodeType {
    Worker,
    Validator,
}

#[account]
pub struct NodeState {
    pub operator: Pubkey,
    pub delegated_worker: Pubkey,
    pub node_type: NodeType,
    pub tier: u8,
    pub free_stake: u64,
    pub locked_stake: u64,
    pub withdrawal_amount: u64,
    pub unlock_epoch: i64,
    pub reputation: u16,
    pub tasks_completed: u32,
    pub tasks_failed: u32,
    pub pending_rewards: u64,
    pub registered_at: i64,
    pub bump: u8,
}
