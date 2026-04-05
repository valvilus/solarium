use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::{NodeState, TaskState, TaskStatus};
use anchor_lang::prelude::*;

pub fn handle(ctx: Context<TimeoutTask>) -> Result<()> {
    let now = Clock::get()?.unix_timestamp;

    require!(
        ctx.accounts.task.status == TaskStatus::Claimed
            || ctx.accounts.task.status == TaskStatus::Committed,
        ProtocolError::TaskNotFinalizable
    );

    require!(
        now > ctx.accounts.task.commit_deadline,
        ProtocolError::DeadlineNotPassed
    );

    let was_claimed_only = ctx.accounts.task.status == TaskStatus::Claimed;

    let reward = ctx.accounts.task.reward;
    ctx.accounts.task.status = TaskStatus::Cancelled;

    **ctx
        .accounts
        .task
        .to_account_info()
        .try_borrow_mut_lamports()? -= reward;
    **ctx
        .accounts
        .creator
        .to_account_info()
        .try_borrow_mut_lamports()? += reward;

    if was_claimed_only {
        let worker_node = &mut ctx.accounts.worker_node;
        let slash = bps_of(MIN_WORKER_STAKE, SLASH_NO_REVEAL_BPS)?;
        worker_node.locked_stake = worker_node
            .locked_stake
            .checked_sub(MIN_WORKER_STAKE)
            .ok_or(ProtocolError::ArithmeticOverflow)?;
        let remainder = MIN_WORKER_STAKE
            .checked_sub(slash)
            .ok_or(ProtocolError::ArithmeticOverflow)?;
        worker_node.free_stake = worker_node
            .free_stake
            .checked_add(remainder)
            .ok_or(ProtocolError::ArithmeticOverflow)?;

        worker_node.reputation = worker_node
            .reputation
            .saturating_sub(REPUTATION_LOSS_NO_REVEAL);
        worker_node.tasks_failed = worker_node.tasks_failed.saturating_add(1);
    }

    Ok(())
}

fn bps_of(amount: u64, bps: u16) -> Result<u64> {
    (amount as u128)
        .checked_mul(bps as u128)
        .and_then(|v| v.checked_div(BPS_DENOMINATOR as u128))
        .map(|v| v as u64)
        .ok_or_else(|| ProtocolError::ArithmeticOverflow.into())
}

#[derive(Accounts)]
pub struct TimeoutTask<'info> {
    pub caller: Signer<'info>,
    #[account(
        mut,
        seeds = [SEED_TASK, &task.task_id.to_le_bytes()],
        bump = task.bump,
    )]
    pub task: Account<'info, TaskState>,
    #[account(
        mut,
        seeds = [SEED_NODE, task.assigned_worker.as_ref()],
        bump = worker_node.bump,
    )]
    pub worker_node: Account<'info, NodeState>,

    #[account(mut, constraint = creator.key() == task.creator @ ProtocolError::Unauthorized)]
    pub creator: AccountInfo<'info>,
}
