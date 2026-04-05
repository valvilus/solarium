use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::NodeState;
use anchor_lang::prelude::*;

pub fn handle(ctx: Context<ClaimRewards>) -> Result<()> {
    let node = &mut ctx.accounts.node_state;
    require!(node.pending_rewards > 0, ProtocolError::NoRewardsAvailable);

    let amount = node.pending_rewards;
    node.pending_rewards = 0;

    **node.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx
        .accounts
        .operator
        .to_account_info()
        .try_borrow_mut_lamports()? += amount;
    Ok(())
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub operator: Signer<'info>,
    #[account(
        mut,
        seeds = [SEED_NODE, operator.key().as_ref()],
        bump = node_state.bump,
        has_one = operator @ ProtocolError::Unauthorized,
    )]
    pub node_state: Account<'info, NodeState>,
}
