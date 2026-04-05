pub mod utils;
use utils::*;

use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::*;
use anchor_lang::prelude::*;

pub fn handle(mut ctx: Context<ResolveOptimisticTask>) -> Result<()> {
    require!(
        ctx.accounts.task.status == TaskStatus::OptimisticFinalized,
        ProtocolError::TaskNotFinalizable
    );

    let now = Clock::get()?.unix_timestamp;
    let window_end = ctx
        .accounts
        .task
        .optimistic_finality_timestamp
        .checked_add(CHALLENGE_WINDOW_SECONDS)
        .ok_or(ProtocolError::ArithmeticOverflow)?;

    require!(now >= window_end, ProtocolError::TaskNotFinalizable);

    if ctx.accounts.worker_commit.revealed_at == 0 {
        let worker_node = &mut ctx.accounts.worker_node;
        let slash = bps_of(MIN_WORKER_STAKE, SLASH_NO_REVEAL_BPS)?;
        worker_node.locked_stake = worker_node.locked_stake.saturating_sub(MIN_WORKER_STAKE);
        worker_node.free_stake = worker_node
            .free_stake
            .saturating_add(MIN_WORKER_STAKE.saturating_sub(slash));
        worker_node.reputation = worker_node
            .reputation
            .saturating_sub(REPUTATION_LOSS_NO_REVEAL);
        worker_node.tasks_failed = worker_node.tasks_failed.saturating_add(1);
        let reward = ctx.accounts.task.reward;
        transfer_lamports(
            &ctx.accounts.task.to_account_info(),
            &ctx.accounts.creator,
            reward,
        )?;
        ctx.accounts.task.status = TaskStatus::Cancelled;
        return Ok(());
    }

    let (agree, disagree, invalid) = count_validator_votes(&ctx)?;

    if invalid > agree && invalid > disagree {
        apply_task_invalidated(&mut ctx, invalid)?;
    } else if agree > disagree {
        apply_consensus_reached(&mut ctx.accounts, agree)?;
    } else {
        apply_consensus_failed(&mut ctx.accounts, disagree)?;
    }

    process_validator_nodes(&ctx, agree, disagree, invalid)?;
    Ok(())
}

#[derive(Accounts)]
pub struct ResolveOptimisticTask<'info> {
    pub caller: Signer<'info>,
    #[account(
        mut,
        seeds = [SEED_PROTOCOL],
        bump = protocol.bump,
    )]
    pub protocol: Account<'info, ProtocolState>,
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
    #[account(
        seeds = [SEED_COMMIT, task.key().as_ref(), task.assigned_worker.as_ref()],
        bump = worker_commit.bump,
    )]
    pub worker_commit: Account<'info, CommitState>,

    #[account(mut, constraint = creator.key() == task.creator @ ProtocolError::Unauthorized)]
    pub creator: AccountInfo<'info>,

    #[account(mut, constraint = treasury.key() == protocol.treasury @ ProtocolError::Unauthorized)]
    pub treasury: AccountInfo<'info>,
}
