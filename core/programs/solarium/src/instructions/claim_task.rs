use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::{NodeState, NodeType, TaskState, TaskStatus};
use anchor_lang::prelude::*;

pub fn handle(ctx: Context<ClaimTask>) -> Result<()> {
    let node = &mut ctx.accounts.node_state;
    require!(
        node.node_type == NodeType::Worker,
        ProtocolError::WorkerOnly
    );
    require!(
        node.free_stake >= MIN_WORKER_STAKE,
        ProtocolError::InsufficientStake
    );
    require!(node.withdrawal_amount == 0, ProtocolError::NodeNotActive);
    require!(
        node.tier >= ctx.accounts.task.tier,
        ProtocolError::InsufficientTier
    );
    require!(
        node.reputation >= MIN_REPUTATION_FOR_TASKS,
        ProtocolError::ReputationTooLow
    );

    let task = &mut ctx.accounts.task;
    require!(task.status == TaskStatus::Open, ProtocolError::TaskNotOpen);

    node.free_stake = node
        .free_stake
        .checked_sub(MIN_WORKER_STAKE)
        .ok_or(ProtocolError::ArithmeticOverflow)?;
    node.locked_stake = node
        .locked_stake
        .checked_add(MIN_WORKER_STAKE)
        .ok_or(ProtocolError::ArithmeticOverflow)?;

    task.assigned_worker = ctx.accounts.node_state.operator;
    task.status = TaskStatus::Claimed;
    task.commit_deadline = Clock::get()?
        .unix_timestamp
        .checked_add(COMMIT_WINDOW_SECONDS)
        .ok_or(ProtocolError::ArithmeticOverflow)?;
    Ok(())
}

#[derive(Accounts)]
pub struct ClaimTask<'info> {
    pub worker: Signer<'info>,

    pub operator: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [SEED_NODE, operator.key().as_ref()],
        bump = node_state.bump,
        has_one = operator @ ProtocolError::Unauthorized,
        constraint = node_state.delegated_worker == worker.key() @ ProtocolError::Unauthorized,
    )]
    pub node_state: Account<'info, NodeState>,
    #[account(
        mut,
        seeds = [SEED_TASK, &task.task_id.to_le_bytes()],
        bump = task.bump,
    )]
    pub task: Account<'info, TaskState>,
}
