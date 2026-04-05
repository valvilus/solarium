use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::NodeState;
use anchor_lang::prelude::*;
use anchor_lang::system_program;

pub fn handle(ctx: Context<DepositStake>, amount: u64) -> Result<()> {
    require!(amount > 0, ProtocolError::InvalidAmount);

    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.operator.to_account_info(),
            to: ctx.accounts.node_state.to_account_info(),
        },
    );
    system_program::transfer(cpi_ctx, amount)?;

    let node = &mut ctx.accounts.node_state;
    node.free_stake = node
        .free_stake
        .checked_add(amount)
        .ok_or(ProtocolError::ArithmeticOverflow)?;

    Ok(())
}

#[derive(Accounts)]
pub struct DepositStake<'info> {
    #[account(mut)]
    pub operator: Signer<'info>,
    #[account(
        mut,
        seeds = [SEED_NODE, operator.key().as_ref()],
        bump = node_state.bump,
        has_one = operator @ ProtocolError::Unauthorized,
    )]
    pub node_state: Account<'info, NodeState>,
    pub system_program: Program<'info, System>,
}
