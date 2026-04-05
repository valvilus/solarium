use anchor_lang::prelude::*;

#[account]
pub struct ProtocolState {
    pub authority: Pubkey,
    pub task_counter: u64,
    pub total_tasks_created: u64,
    pub total_tasks_completed: u64,
    pub active_workers: u32,
    pub active_validators: u32,
    pub protocol_fee_bps: u16,
    pub min_worker_stake: u64,
    pub min_validator_stake: u64,
    pub cooldown_period: i64,
    pub treasury: Pubkey,
    pub bump: u8,
}
