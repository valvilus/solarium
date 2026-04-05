use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("8pUwQgJBiBrNkayeVoeCB5cKYNEujcMaULQvTRK4KUMd");

#[program]
pub mod solarium {
    use super::*;

    pub fn initialize_protocol(ctx: Context<InitializeProtocol>, treasury: Pubkey) -> Result<()> {
        instructions::initialize_protocol::handle(ctx, treasury)
    }

    pub fn register_node(
        ctx: Context<RegisterNode>,
        worker_pubkey: Pubkey,
        node_type: u8,
        tier: u8,
    ) -> Result<()> {
        instructions::register_node::handle(ctx, worker_pubkey, node_type, tier)
    }

    pub fn deposit_stake(ctx: Context<DepositStake>, amount: u64) -> Result<()> {
        instructions::deposit_stake::handle(ctx, amount)
    }

    pub fn request_withdrawal(ctx: Context<RequestWithdrawal>, amount: u64) -> Result<()> {
        instructions::request_withdrawal::handle(ctx, amount)
    }

    pub fn execute_withdrawal(ctx: Context<ExecuteWithdrawal>) -> Result<()> {
        instructions::execute_withdrawal::handle(ctx)
    }

    pub fn create_task(
        ctx: Context<CreateTask>,
        task_id: u64,
        input_hash: [u8; 32],
        task_type: u8,
        tier: u8,
        reward: u64,
        validator_count: u8,
    ) -> Result<()> {
        instructions::create_task::handle(
            ctx,
            task_id,
            input_hash,
            task_type,
            tier,
            reward,
            validator_count,
        )
    }

    pub fn cancel_task(ctx: Context<CancelTask>) -> Result<()> {
        instructions::cancel_task::handle(ctx)
    }

    pub fn claim_task(ctx: Context<ClaimTask>) -> Result<()> {
        instructions::claim_task::handle(ctx)
    }

    pub fn commit_result(
        ctx: Context<CommitResult>,
        commitment: [u8; 32],
        reasoning_hash: [u8; 32],
        trace_hash: [u8; 32],
    ) -> Result<()> {
        instructions::commit_result::handle(ctx, commitment, reasoning_hash, trace_hash)
    }

    pub fn reveal_result(
        ctx: Context<RevealResult>,
        verdict: u8,
        confidence: u8,
        salt: [u8; 32],
    ) -> Result<()> {
        instructions::reveal_result::handle(ctx, verdict, confidence, salt)
    }

    pub fn finalize_task(ctx: Context<FinalizeTask>) -> Result<()> {
        instructions::finalize_task::handle(ctx)
    }

    pub fn challenge_task(ctx: Context<ChallengeTask>) -> Result<()> {
        instructions::challenge_task::handle(ctx)
    }

    pub fn resolve_optimistic_task(ctx: Context<ResolveOptimisticTask>) -> Result<()> {
        instructions::consensus::handle(ctx)
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        instructions::claim_rewards::handle(ctx)
    }

    pub fn timeout_task(ctx: Context<TimeoutTask>) -> Result<()> {
        instructions::timeout_task::handle(ctx)
    }
}
