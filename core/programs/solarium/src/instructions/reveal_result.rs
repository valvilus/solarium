use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::*;
use anchor_lang::prelude::*;
use sha2::{Digest, Sha256};

pub fn handle(
    ctx: Context<RevealResult>,
    verdict: u8,
    confidence: u8,
    salt: [u8; 32],
) -> Result<()> {
    let task = &ctx.accounts.task;
    require!(
        task.status == TaskStatus::Revealing,
        ProtocolError::TaskNotRevealing
    );

    let now = Clock::get()?.unix_timestamp;
    require!(
        now < task.reveal_deadline,
        ProtocolError::RevealDeadlinePassed
    );

    let commit = &mut ctx.accounts.commit_state;
    require!(commit.revealed_at == 0, ProtocolError::AlreadyRevealed);

    let computed = compute_commitment(
        &ctx.accounts.node_state.node_type,
        verdict,
        confidence,
        &salt,
    );
    require!(computed == commit.commitment, ProtocolError::InvalidReveal);

    match ctx.accounts.node_state.node_type {
        NodeType::Worker => {
            commit.revealed_verdict = Verdict::from_byte(verdict);
            commit.revealed_confidence = confidence;
        }
        NodeType::Validator => {
            commit.validation_vote = ValidationVote::from_byte(verdict);
        }
    }
    commit.revealed_at = now;

    let task = &mut ctx.accounts.task;
    task.reveals_received = task
        .reveals_received
        .checked_add(1)
        .ok_or(ProtocolError::ArithmeticOverflow)?;
    Ok(())
}

fn compute_commitment(
    node_type: &NodeType,
    verdict: u8,
    confidence: u8,
    salt: &[u8; 32],
) -> [u8; 32] {
    let mut hasher = Sha256::new();
    match node_type {
        NodeType::Worker => {
            hasher.update([verdict, confidence]);
        }
        NodeType::Validator => {
            hasher.update([verdict]);
        }
    }
    hasher.update(salt);
    hasher.finalize().into()
}

#[derive(Accounts)]
pub struct RevealResult<'info> {
    pub worker: Signer<'info>,

    pub operator: UncheckedAccount<'info>,
    #[account(
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
        mut,
        seeds = [SEED_COMMIT, task.key().as_ref(), operator.key().as_ref()],
        bump = commit_state.bump,
    )]
    pub commit_state: Account<'info, CommitState>,
}
