use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::*;
use anchor_lang::prelude::*;

pub fn handle(
    ctx: Context<CommitResult>,
    commitment: [u8; 32],
    reasoning_hash: [u8; 32],
    trace_hash: [u8; 32],
) -> Result<()> {
    let node = &mut ctx.accounts.node_state;
    require!(node.withdrawal_amount == 0, ProtocolError::NodeNotActive);

    match node.node_type {
        NodeType::Worker => {
            require!(
                ctx.accounts.task.assigned_worker == node.operator,
                ProtocolError::WorkerNotAssigned
            );
            require!(
                ctx.accounts.task.status == TaskStatus::Claimed,
                ProtocolError::TaskNotClaimed
            );
        }
        NodeType::Validator => {
            require!(
                ctx.accounts.task.status == TaskStatus::Committed,
                ProtocolError::WorkerNotCommitted
            );
            require!(
                node.free_stake >= MIN_VALIDATOR_STAKE,
                ProtocolError::InsufficientStake
            );
            node.free_stake = node
                .free_stake
                .checked_sub(MIN_VALIDATOR_STAKE)
                .ok_or(ProtocolError::ArithmeticOverflow)?;
            node.locked_stake = node
                .locked_stake
                .checked_add(MIN_VALIDATOR_STAKE)
                .ok_or(ProtocolError::ArithmeticOverflow)?;
        }
    }

    let now = Clock::get()?.unix_timestamp;
    require!(
        now < ctx.accounts.task.commit_deadline,
        ProtocolError::CommitDeadlinePassed
    );

    let commit = &mut ctx.accounts.commit_state;
    commit.task = ctx.accounts.task.key();
    commit.operator = node.operator;
    commit.role = node.node_type;
    commit.commitment = commitment;
    commit.revealed_verdict = Verdict::None;
    commit.revealed_confidence = 0;
    commit.validation_vote = ValidationVote::Unrevealed;
    commit.reasoning_hash = reasoning_hash;
    commit.trace_hash = trace_hash;
    commit.committed_at = now;
    commit.revealed_at = 0;
    commit.bump = ctx.bumps.commit_state;

    let task = &mut ctx.accounts.task;
    task.commits_received = task
        .commits_received
        .checked_add(1)
        .ok_or(ProtocolError::ArithmeticOverflow)?;

    if node.node_type == NodeType::Worker {
        task.status = TaskStatus::Committed;
    }

    let expected = 1u8
        .checked_add(task.validator_count)
        .ok_or(ProtocolError::ArithmeticOverflow)?;
    if task.commits_received >= expected {
        task.status = TaskStatus::Revealing;
        task.reveal_deadline = now
            .checked_add(REVEAL_WINDOW_SECONDS)
            .ok_or(ProtocolError::ArithmeticOverflow)?;
    }
    Ok(())
}

#[derive(Accounts)]
pub struct CommitResult<'info> {
    #[account(mut)]
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
    #[account(
        init,
        payer = worker,
        space = COMMIT_STATE_SIZE,
        seeds = [SEED_COMMIT, task.key().as_ref(), operator.key().as_ref()],
        bump,
    )]
    pub commit_state: Account<'info, CommitState>,
    pub system_program: Program<'info, System>,
}
