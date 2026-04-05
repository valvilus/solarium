use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::{NodeState, ProtocolState};
use anchor_lang::prelude::*;

pub fn handle(ctx: Context<ExecuteWithdrawal>) -> Result<()> {
    let node = &mut ctx.accounts.node_state;
    require!(node.withdrawal_amount > 0, ProtocolError::InsufficientStake);

    let now = Clock::get()?.unix_timestamp;
    require!(now >= node.unlock_epoch, ProtocolError::CooldownNotComplete);

    let amount_to_withdraw = node.withdrawal_amount;
    node.withdrawal_amount = 0;

    node.sub_lamports(amount_to_withdraw)?;
    ctx.accounts.operator.add_lamports(amount_to_withdraw)?;

    Ok(())
}

#[derive(Accounts)]
pub struct ExecuteWithdrawal<'info> {
    #[account(mut)]
    pub operator: Signer<'info>,
    #[account(
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
