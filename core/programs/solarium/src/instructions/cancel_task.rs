use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::{TaskState, TaskStatus};
use anchor_lang::prelude::*;

pub fn handle(ctx: Context<CancelTask>) -> Result<()> {
    let task = &mut ctx.accounts.task;
    require!(task.status == TaskStatus::Open, ProtocolError::TaskNotOpen);

    let reward = task.reward;
    task.status = TaskStatus::Cancelled;

    **task.to_account_info().try_borrow_mut_lamports()? -= reward;
    **ctx
        .accounts
        .creator
        .to_account_info()
        .try_borrow_mut_lamports()? += reward;
    Ok(())
}

#[derive(Accounts)]
pub struct CancelTask<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        mut,
        seeds = [SEED_TASK, &task.task_id.to_le_bytes()],
        bump = task.bump,
        has_one = creator @ ProtocolError::Unauthorized,
    )]
    pub task: Account<'info, TaskState>,
}
