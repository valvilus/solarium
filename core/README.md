# core/

Solana smart contracts for the Solarium Protocol. Written in Rust using Anchor v0.32.

## Structure

```
programs/solarium/src/
  lib.rs                    Entry point, program ID, instruction routing
  constants.rs              Reward BPS, stake minimums, time windows
  errors.rs                 ErrorCode enum
  state/
    task.rs                 TaskState PDA, TaskStatus FSM, Verdict enum
    node.rs                 NodeState PDA (free_stake, locked_stake, withdrawal)
    protocol.rs             ProtocolState PDA (global counters, treasury)
    commit.rs               CommitState PDA (per-node commit hashes)
  instructions/
    register_node.rs        Node onboarding with operator/worker key pair
    deposit_stake.rs        Add lamports to free_stake
    request_withdrawal.rs   Move free_stake to withdrawal queue with cooldown
    execute_withdrawal.rs   Claim funds after unlock_epoch expires
    create_task.rs          DApp submits task with IPFS manifest hash and escrow
    claim_task.rs           Worker locks stake and claims an open task
    commit_result.rs        Submit hash(verdict + salt) during commit phase
    reveal_result.rs        Open the commitment, verify hash integrity
    finalize_task.rs        Tally votes, transition to OptimisticFinalized
    challenge_task.rs       Post a bond to dispute optimistic result
    consensus/              Resolve optimistic tasks after challenge window
    timeout_task.rs         Garbage-collect dead tasks, slash idle workers
    cancel_task.rs          Creator cancels an unclaimed task
    claim_rewards.rs        Withdraw accumulated node rewards
```

## Commands

```bash
anchor build           # Compile and generate IDL
anchor test            # Run all 8 test suites on localnet
anchor deploy          # Deploy to configured cluster
```

## Security Model

- All arithmetic uses `checked_add` / `checked_sub` to prevent overflow.
- No `unwrap()` in production instruction handlers.
- Signer and owner validation on every mutable account.
- PDA bumps stored on-account and reused on subsequent calls.
- Capital control: withdrawal requests enforce a cooldown period; slashing prioritizes locked funds before queued withdrawals.
