use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::{NodeState, NodeType, ProtocolState};
use anchor_lang::prelude::*;
use anchor_lang::system_program;

pub fn handle(
    ctx: Context<RegisterNode>,
    worker_pubkey: Pubkey,
    node_type: u8,
    tier: u8,
) -> Result<()> {
    require!(
        tier >= MIN_TIER && tier <= MAX_TIER,
        ProtocolError::InvalidTier
    );

    let parsed_type = parse_node_type(node_type)?;
    let required_stake = match parsed_type {
        NodeType::Worker => ctx.accounts.protocol.min_worker_stake,
        NodeType::Validator => ctx.accounts.protocol.min_validator_stake,
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.operator.to_account_info(),
            to: ctx.accounts.node_state.to_account_info(),
        },
    );
    system_program::transfer(cpi_ctx, required_stake)?;

    let node = &mut ctx.accounts.node_state;
    node.operator = ctx.accounts.operator.key();
    node.delegated_worker = worker_pubkey;
    node.node_type = parsed_type;
    node.tier = tier;
    node.free_stake = required_stake;
    node.locked_stake = 0;
    node.withdrawal_amount = 0;
    node.unlock_epoch = 0;
    node.reputation = INITIAL_REPUTATION;
    node.tasks_completed = 0;
    node.tasks_failed = 0;
    node.pending_rewards = 0;
    node.registered_at = Clock::get()?.unix_timestamp;
    node.bump = ctx.bumps.node_state;

    update_protocol_counters(&mut ctx.accounts.protocol, &parsed_type, true);
    Ok(())
}

fn parse_node_type(node_type: u8) -> Result<NodeType> {
    match node_type {
        0 => Ok(NodeType::Worker),
        1 => Ok(NodeType::Validator),
        _ => Err(ProtocolError::InvalidTier.into()),
    }
}

fn update_protocol_counters(protocol: &mut ProtocolState, node_type: &NodeType, increment: bool) {
    match node_type {
        NodeType::Worker => {
            if increment {
                protocol.active_workers = protocol.active_workers.saturating_add(1);
            } else {
                protocol.active_workers = protocol.active_workers.saturating_sub(1);
            }
        }
        NodeType::Validator => {
            if increment {
                protocol.active_validators = protocol.active_validators.saturating_add(1);
            } else {
                protocol.active_validators = protocol.active_validators.saturating_sub(1);
            }
        }
    }
}

#[derive(Accounts)]
pub struct RegisterNode<'info> {
    #[account(mut)]
    pub operator: Signer<'info>,
    #[account(
        mut,
        seeds = [SEED_PROTOCOL],
        bump = protocol.bump,
    )]
    pub protocol: Account<'info, ProtocolState>,
    #[account(
        init,
        payer = operator,
        space = NODE_STATE_SIZE,
        seeds = [SEED_NODE, operator.key().as_ref()],
        bump,
    )]
    pub node_state: Account<'info, NodeState>,
    pub system_program: Program<'info, System>,
}
