use anchor_lang::prelude::*;

#[error_code]
pub enum ProtocolError {
    #[msg("Insufficient stake amount")]
    InsufficientStake,
    #[msg("Invalid tier value")]
    InvalidTier,
    #[msg("Node is in cooldown period")]
    NodeInCooldown,
    #[msg("Cooldown period has not completed")]
    CooldownNotComplete,
    #[msg("Task is not in OPEN status")]
    TaskNotOpen,
    #[msg("Task is not in CLAIMED status")]
    TaskNotClaimed,
    #[msg("Node tier is too low for this task")]
    InsufficientTier,
    #[msg("Only Worker nodes can claim tasks")]
    WorkerOnly,
    #[msg("Commit deadline has passed")]
    CommitDeadlinePassed,
    #[msg("Reveal deadline has passed")]
    RevealDeadlinePassed,
    #[msg("Reveal does not match commitment")]
    InvalidReveal,
    #[msg("Task is not ready for finalization")]
    TaskNotFinalizable,
    #[msg("No rewards available to claim")]
    NoRewardsAvailable,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
    #[msg("Invalid validator count")]
    InvalidValidatorCount,
    #[msg("Worker must commit before validators")]
    WorkerNotCommitted,
    #[msg("Node reputation too low")]
    ReputationTooLow,
    #[msg("Task is not in REVEALING status")]
    TaskNotRevealing,
    #[msg("Already revealed")]
    AlreadyRevealed,
    #[msg("Invalid task id")]
    InvalidTaskId,
    #[msg("Worker not assigned to this task")]
    WorkerNotAssigned,
    #[msg("Node not active")]
    NodeNotActive,
    #[msg("Invalid remaining accounts")]
    InvalidRemainingAccounts,
    #[msg("Deadline has not passed yet")]
    DeadlineNotPassed,
    #[msg("Task was invalidated by the network")]
    TaskInvalidByNetwork,
    #[msg("Invalid amount for operation.")]
    InvalidAmount,
}
