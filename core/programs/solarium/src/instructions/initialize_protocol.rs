use crate::constants::*;
use crate::state::ProtocolState;
use anchor_lang::prelude::*;

pub fn handle(ctx: Context<InitializeProtocol>, treasury: Pubkey) -> Result<()> {
    let protocol = &mut ctx.accounts.protocol;
    protocol.authority = ctx.accounts.authority.key();
    protocol.task_counter = 0;
    protocol.total_tasks_created = 0;
    protocol.total_tasks_completed = 0;
    protocol.active_workers = 0;
    protocol.active_validators = 0;
    protocol.protocol_fee_bps = PROTOCOL_FEE_BPS;
    protocol.min_worker_stake = MIN_WORKER_STAKE;
    protocol.min_validator_stake = MIN_VALIDATOR_STAKE;
    protocol.cooldown_period = COOLDOWN_PERIOD_SECONDS;
    protocol.treasury = treasury;
    protocol.bump = ctx.bumps.protocol;
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeProtocol<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = PROTOCOL_STATE_SIZE,
        seeds = [SEED_PROTOCOL],
        bump,
    )]
    pub protocol: Account<'info, ProtocolState>,
    pub system_program: Program<'info, System>,
}
