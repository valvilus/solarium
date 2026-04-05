use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::{NodeState, ProtocolState};
use anchor_lang::prelude::*;

pub fn handle(ctx: Context<RequestWithdrawal>, amount: u64) -> Result<()> {
    let node = &mut ctx.accounts.node_state;
    require!(node.free_stake >= amount, ProtocolError::InsufficientStake);

    node.free_stake = node
        .free_stake
        .checked_sub(amount)
        .ok_or(ProtocolError::ArithmeticOverflow)?;
    node.withdrawal_amount = node
        .withdrawal_amount
        .checked_add(amount)
        .ok_or(ProtocolError::ArithmeticOverflow)?;

    let now = Clock::get()?.unix_timestamp;
    node.unlock_epoch = now
        .checked_add(WITHDRAWAL_COOLDOWN_SECONDS)
        .ok_or(ProtocolError::ArithmeticOverflow)?;

    Ok(())
}

#[derive(Accounts)]
pub struct RequestWithdrawal<'info> {
    pub operator: Signer<'info>,
    #[account(
        mut,
        seeds = [SEED_PROTOCOL],
        bump = protocol.bump,
    )]
    pub protocol: Account<'info, ProtocolState>,
    #[account(
        mut,
        seeds = [SEED_NODE, operator.key().as_ref()],
        bump = node_state.bump,
        has_one = operator @ ProtocolError::Unauthorized,
    )]
    pub node_state: Account<'info, NodeState>,
}
