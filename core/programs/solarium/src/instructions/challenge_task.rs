use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::{TaskState, TaskStatus};
use anchor_lang::prelude::*;
use anchor_lang::system_program;

pub fn handle(ctx: Context<ChallengeTask>) -> Result<()> {
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

    require!(now <= window_end, ProtocolError::CommitDeadlinePassed);

    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.challenger.to_account_info(),
            to: ctx.accounts.task.to_account_info(),
        },
    );
    system_program::transfer(cpi_ctx, MIN_CHALLENGE_BOND)?;

    ctx.accounts.task.status = TaskStatus::Challenged;
    Ok(())
}

#[derive(Accounts)]
pub struct ChallengeTask<'info> {
    #[account(mut)]
    pub challenger: Signer<'info>,
    #[account(
        mut,
        seeds = [SEED_TASK, &task.task_id.to_le_bytes()],
        bump = task.bump,
    )]
    pub task: Account<'info, TaskState>,
    pub system_program: Program<'info, System>,
}
