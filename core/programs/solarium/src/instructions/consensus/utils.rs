use super::ResolveOptimisticTask;
use crate::constants::*;
use crate::errors::ProtocolError;
use crate::state::*;
use anchor_lang::prelude::*;

pub fn apply_consensus_reached(
    accounts: &mut ResolveOptimisticTask,
    _agree_count: u64,
) -> Result<()> {
    let reward = accounts.task.reward;
    let fee = bps_of(reward, accounts.protocol.protocol_fee_bps)?;
    let net = reward
        .checked_sub(fee)
        .ok_or(ProtocolError::ArithmeticOverflow)?;
    let worker_reward = bps_of(net, WORKER_REWARD_BPS)?;

    transfer_lamports(&accounts.task.to_account_info(), &accounts.treasury, fee)?;
    transfer_lamports(
        &accounts.task.to_account_info(),
        &accounts.worker_node.to_account_info(),
        worker_reward,
    )?;

    accounts.worker_node.pending_rewards = accounts
        .worker_node
        .pending_rewards
        .saturating_add(worker_reward);
    accounts.worker_node.locked_stake = accounts
        .worker_node
        .locked_stake
        .saturating_sub(MIN_WORKER_STAKE);
    accounts.worker_node.free_stake = accounts
        .worker_node
        .free_stake
        .saturating_add(MIN_WORKER_STAKE);
    accounts.worker_node.reputation = accounts
        .worker_node
        .reputation
        .saturating_add(REPUTATION_GAIN_PER_TASK)
        .min(MAX_REPUTATION);
    accounts.worker_node.tasks_completed = accounts.worker_node.tasks_completed.saturating_add(1);

    accounts.task.final_verdict = accounts.worker_commit.revealed_verdict;
    accounts.task.final_confidence = accounts.worker_commit.revealed_confidence;
    accounts.task.status = TaskStatus::Finalized;
    accounts.protocol.total_tasks_completed =
        accounts.protocol.total_tasks_completed.saturating_add(1);
    Ok(())
}

pub fn apply_consensus_failed(
    accounts: &mut ResolveOptimisticTask,
    _disagree_count: u64,
) -> Result<()> {
    let slash = bps_of(MIN_WORKER_STAKE, SLASH_WRONG_VERDICT_BPS)?;
    accounts.worker_node.locked_stake = accounts
        .worker_node
        .locked_stake
        .saturating_sub(MIN_WORKER_STAKE);
    accounts.worker_node.free_stake = accounts
        .worker_node
        .free_stake
        .saturating_add(MIN_WORKER_STAKE.saturating_sub(slash));
    accounts.worker_node.reputation = accounts
        .worker_node
        .reputation
        .saturating_sub(REPUTATION_LOSS_PER_SLASH);
    accounts.worker_node.tasks_failed = accounts.worker_node.tasks_failed.saturating_add(1);

    let reward = accounts.task.reward;
    let validator_pool = bps_of(reward, VALIDATOR_REWARD_BPS)?;
    let refund = reward
        .checked_sub(validator_pool)
        .ok_or(ProtocolError::ArithmeticOverflow)?;
    transfer_lamports(&accounts.task.to_account_info(), &accounts.creator, refund)?;

    accounts.task.status = TaskStatus::Invalidated;
    Ok(())
}

pub fn apply_task_invalidated(
    ctx: &mut Context<ResolveOptimisticTask>,
    invalid_count: u64,
) -> Result<()> {
    let reward = ctx.accounts.task.reward;
    let total_nodes = invalid_count.saturating_add(1);
    let per_node = safe_div(reward, total_nodes)?;

    if per_node > 0 {
        transfer_lamports(
            &ctx.accounts.task.to_account_info(),
            &ctx.accounts.worker_node.to_account_info(),
            per_node,
        )?;
        ctx.accounts.worker_node.pending_rewards = ctx
            .accounts
            .worker_node
            .pending_rewards
            .saturating_add(per_node);
    }

    ctx.accounts.task.status = TaskStatus::Invalidated;
    Ok(())
}

pub fn count_validator_votes(ctx: &Context<ResolveOptimisticTask>) -> Result<(u64, u64, u64)> {
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

pub fn process_validator_nodes(
    ctx: &Context<ResolveOptimisticTask>,
    agree: u64,
    disagree: u64,
    invalid: u64,
) -> Result<()> {
    let pair_count = ctx.remaining_accounts.len() / 2;
    let reward = ctx.accounts.task.reward;
    let invalidated = invalid > agree && invalid > disagree;
    let consensus_reached = agree > disagree && !invalidated;

    let net = if consensus_reached {
        let fee = bps_of(reward, ctx.accounts.protocol.protocol_fee_bps)?;
        reward
            .checked_sub(fee)
            .ok_or(ProtocolError::ArithmeticOverflow)?
    } else {
        reward
    };
    let pool = bps_of(net, VALIDATOR_REWARD_BPS)?;

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
            slash_unrevealed(node_info)?;
            continue;
        }

        if invalidated {
            if commit.validation_vote == ValidationVote::Invalid {
                let per_val = safe_div(pool, invalid)?;
                if per_val > 0 {
                    transfer_lamports(&ctx.accounts.task.to_account_info(), node_info, per_val)?;
                }
                credit_validator(node_info, per_val)?;
            } else {
                slash_wrong_validator(node_info)?;
            }
            continue;
        }

        let is_agree = commit.validation_vote == ValidationVote::Agree;
        let should_pay = (consensus_reached && is_agree) || (!consensus_reached && !is_agree);

        if should_pay {
            let count = count_matching_votes(ctx, consensus_reached)?;
            let per_val = safe_div(pool, count)?;
            if per_val > 0 {
                transfer_lamports(&ctx.accounts.task.to_account_info(), node_info, per_val)?;
            }
            credit_validator(node_info, per_val)?;
        } else {
            slash_wrong_validator(node_info)?;
        }
    }
    Ok(())
}

pub fn count_matching_votes(
    ctx: &Context<ResolveOptimisticTask>,
    count_agreers: bool,
) -> Result<u64> {
    let mut count: u64 = 0;
    let pair_count = ctx.remaining_accounts.len() / 2;
    for i in 0..pair_count {
        let ni = &ctx.remaining_accounts[i * 2];
        let ci = &ctx.remaining_accounts[i * 2 + 1];
        let c = validate_account_pair(ctx.program_id, &ctx.accounts.task.key(), ni, ci)?;
        if c.revealed_at == 0 {
            continue;
        }
        let is_agree = c.validation_vote == ValidationVote::Agree;
        if (count_agreers && is_agree) || (!count_agreers && !is_agree) {
            count = count.saturating_add(1);
        }
    }
    Ok(count)
}

pub fn slash_unrevealed(node_info: &AccountInfo) -> Result<()> {
    let mut data = node_info.try_borrow_mut_data()?;
    let mut node = NodeState::try_deserialize(&mut &data[..])?;
    let slash = bps_of(MIN_VALIDATOR_STAKE, SLASH_NO_REVEAL_BPS)?;
    node.locked_stake = node.locked_stake.saturating_sub(MIN_VALIDATOR_STAKE);
    node.free_stake = node
        .free_stake
        .saturating_add(MIN_VALIDATOR_STAKE.saturating_sub(slash));
    node.reputation = node.reputation.saturating_sub(REPUTATION_LOSS_NO_REVEAL);
    node.tasks_failed = node.tasks_failed.saturating_add(1);
    node.serialize(&mut &mut data[8..])?;
    Ok(())
}

pub fn credit_validator(info: &AccountInfo, reward: u64) -> Result<()> {
    let mut data = info.try_borrow_mut_data()?;
    let mut node = NodeState::try_deserialize(&mut &data[..])?;
    node.locked_stake = node.locked_stake.saturating_sub(MIN_VALIDATOR_STAKE);
    node.free_stake = node.free_stake.saturating_add(MIN_VALIDATOR_STAKE);
    node.pending_rewards = node.pending_rewards.saturating_add(reward);
    node.reputation = node
        .reputation
        .saturating_add(REPUTATION_GAIN_PER_TASK)
        .min(MAX_REPUTATION);
    node.tasks_completed = node.tasks_completed.saturating_add(1);
    node.serialize(&mut &mut data[8..])?;
    Ok(())
}

pub fn slash_wrong_validator(info: &AccountInfo) -> Result<()> {
    let mut data = info.try_borrow_mut_data()?;
    let mut node = NodeState::try_deserialize(&mut &data[..])?;
    let slash = bps_of(MIN_VALIDATOR_STAKE, SLASH_WRONG_VERDICT_BPS)?;
    node.locked_stake = node.locked_stake.saturating_sub(MIN_VALIDATOR_STAKE);
    node.free_stake = node
        .free_stake
        .saturating_add(MIN_VALIDATOR_STAKE.saturating_sub(slash));
    node.reputation = node.reputation.saturating_sub(REPUTATION_LOSS_PER_SLASH);
    node.tasks_failed = node.tasks_failed.saturating_add(1);
    node.serialize(&mut &mut data[8..])?;
    Ok(())
}

pub fn transfer_lamports(from: &AccountInfo, to: &AccountInfo, amount: u64) -> Result<()> {
    **from.try_borrow_mut_lamports()? -= amount;
    **to.try_borrow_mut_lamports()? += amount;
    Ok(())
}

pub fn bps_of(amount: u64, bps: u16) -> Result<u64> {
    (amount as u128)
        .checked_mul(bps as u128)
        .and_then(|v| v.checked_div(BPS_DENOMINATOR as u128))
        .map(|v| v as u64)
        .ok_or_else(|| ProtocolError::ArithmeticOverflow.into())
}

pub fn safe_div(a: u64, b: u64) -> Result<u64> {
    if b == 0 {
        return Ok(0);
    }
    a.checked_div(b)
        .ok_or_else(|| ProtocolError::ArithmeticOverflow.into())
}

pub fn validate_account_pair(
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
