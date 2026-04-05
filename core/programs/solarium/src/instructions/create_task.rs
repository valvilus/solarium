use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::{ProtocolState, TaskState, TaskStatus, TaskType, Verdict};
use anchor_lang::prelude::*;
use anchor_lang::system_program;

pub fn handle(
    ctx: Context<CreateTask>,
    task_id: u64,
    input_hash: [u8; 32],
    task_type: u8,
    tier: u8,
    reward: u64,
    validator_count: u8,
) -> Result<()> {
    let protocol = &ctx.accounts.protocol;
    require!(
        task_id == protocol.task_counter,
        ProtocolError::InvalidTaskId
    );
    require!(
        tier >= MIN_TIER && tier <= MAX_TIER,
        ProtocolError::InvalidTier
    );
    require!(reward > 0, ProtocolError::InsufficientStake);
    require!(
        validator_count >= MIN_VALIDATORS_PER_TASK && validator_count <= MAX_VALIDATORS_PER_TASK,
        ProtocolError::InvalidValidatorCount
    );

    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.creator.to_account_info(),
            to: ctx.accounts.task.to_account_info(),
        },
    );
    system_program::transfer(cpi_ctx, reward)?;

    let task = &mut ctx.accounts.task;
    task.task_id = task_id;
    task.creator = ctx.accounts.creator.key();
    task.input_hash = input_hash;
    task.task_type = parse_task_type(task_type);
    task.tier = tier;
    task.reward = reward;
    task.validator_count = validator_count;
    task.status = TaskStatus::Open;
    task.assigned_worker = Pubkey::default();
    task.final_verdict = Verdict::None;
    task.final_confidence = 0;
    task.commit_deadline = 0;
    task.reveal_deadline = 0;
    task.commits_received = 0;
    task.reveals_received = 0;
    task.created_at = Clock::get()?.unix_timestamp;
    task.bump = ctx.bumps.task;

    let protocol = &mut ctx.accounts.protocol;
    protocol.task_counter = protocol
        .task_counter
        .checked_add(1)
        .ok_or(ProtocolError::ArithmeticOverflow)?;
    protocol.total_tasks_created = protocol
        .total_tasks_created
        .checked_add(1)
        .ok_or(ProtocolError::ArithmeticOverflow)?;
    Ok(())
}

fn parse_task_type(t: u8) -> TaskType {
    match t {
        1 => TaskType::Simulate,
        2 => TaskType::Classify,
        3 => TaskType::Generate,
        _ => TaskType::Analyze,
    }
}

#[derive(Accounts)]
#[instruction(task_id: u64)]
pub struct CreateTask<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        mut,
        seeds = [SEED_PROTOCOL],
        bump = protocol.bump,
    )]
    pub protocol: Account<'info, ProtocolState>,
    #[account(
        init,
        payer = creator,
        space = TASK_STATE_SIZE,
        seeds = [SEED_TASK, &task_id.to_le_bytes()],
        bump,
    )]
    pub task: Account<'info, TaskState>,
    pub system_program: Program<'info, System>,
}
