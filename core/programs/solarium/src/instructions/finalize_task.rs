use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::*;
use anchor_lang::prelude::*;

pub fn handle(ctx: Context<FinalizeTask>) -> Result<()> {
    require!(
        ctx.accounts.task.status == TaskStatus::Revealing,
        ProtocolError::TaskNotFinalizable
    );

    let now = Clock::get()?.unix_timestamp;
    let total_expected = 1u8.saturating_add(ctx.accounts.task.validator_count);
    let all_revealed = ctx.accounts.task.reveals_received >= total_expected;
    require!(
        now >= ctx.accounts.task.reveal_deadline || all_revealed,
        ProtocolError::TaskNotFinalizable
    );

    if ctx.accounts.worker_commit.revealed_at == 0 {
        ctx.accounts.task.status = TaskStatus::Challenged;
        ctx.accounts.task.optimistic_finality_timestamp = now;
        return Ok(());
    }

    let (agree, disagree, invalid) = count_validator_votes(&ctx)?;

    if invalid > agree && invalid > disagree {
        ctx.accounts.task.status = TaskStatus::OptimisticFinalized;
    } else if agree > disagree {
        ctx.accounts.task.final_verdict = ctx.accounts.worker_commit.revealed_verdict;
        ctx.accounts.task.final_confidence = ctx.accounts.worker_commit.revealed_confidence;
        ctx.accounts.task.status = TaskStatus::OptimisticFinalized;
    } else {
        ctx.accounts.task.status = TaskStatus::OptimisticFinalized;
    }

    ctx.accounts.task.optimistic_finality_timestamp = now;

    Ok(())
}

fn count_validator_votes(ctx: &Context<FinalizeTask>) -> Result<(u64, u64, u64)> {
    let mut agree: u64 = 0;
    let mut disagree: u64 = 0;
    let mut invalid: u64 = 0;
    let pair_count = ctx.remaining_accounts.len() / 2;
    for i in 0..pair_count {
        let node_info = &ctx.remaining_accounts[i * 2];
        let commit_info = &ctx.remaining_accounts[i * 2 + 1];
        let commit = validate_account_pair(
            ctx.program_id,
            &ctx.accounts.task.key(),
            node_info,
            commit_info,
        )?;
        if commit.revealed_at == 0 {
            disagree = disagree.saturating_add(1);
            continue;
        }
        match commit.validation_vote {
            ValidationVote::Agree => agree = agree.saturating_add(1),
            ValidationVote::Disagree => disagree = disagree.saturating_add(1),
            ValidationVote::Invalid => invalid = invalid.saturating_add(1),
            ValidationVote::Unrevealed => disagree = disagree.saturating_add(1),
        }
    }
    Ok((agree, disagree, invalid))
}

fn validate_account_pair(
    program_id: &Pubkey,
    task_key: &Pubkey,
    node_info: &AccountInfo,
    commit_info: &AccountInfo,
) -> Result<CommitState> {
    let commit_data = commit_info.try_borrow_data()?;
    let commit = CommitState::try_deserialize(&mut &commit_data[..])?;
    require_keys_eq!(commit.task, *task_key, ProtocolError::Unauthorized);

    let expected_commit = Pubkey::find_program_address(
        &[SEED_COMMIT, task_key.as_ref(), commit.operator.as_ref()],
        program_id,
    )
    .0;
    require_keys_eq!(
        commit_info.key(),
        expected_commit,
        ProtocolError::Unauthorized
    );

    let expected_node =
        Pubkey::find_program_address(&[SEED_NODE, commit.operator.as_ref()], program_id).0;
    require_keys_eq!(node_info.key(), expected_node, ProtocolError::Unauthorized);

    Ok(commit)
}

#[derive(Accounts)]
pub struct FinalizeTask<'info> {
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
