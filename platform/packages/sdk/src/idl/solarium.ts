/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solarium.json`.
 */
export type Solarium = {
  address: "8pUwQgJBiBrNkayeVoeCB5cKYNEujcMaULQvTRK4KUMd";
  metadata: {
    name: "solarium";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Solarium Protocol - Decentralized Verifiable AI Inference Network";
  };
  instructions: [
    {
      name: "cancelTask";
      discriminator: [69, 228, 134, 187, 134, 105, 238, 48];
      accounts: [
        {
          name: "creator";
          writable: true;
          signer: true;
          relations: ["task"];
        },
        {
          name: "task";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [116, 97, 115, 107];
              },
              {
                kind: "account";
                path: "task.task_id";
                account: "taskState";
              },
            ];
          };
        },
      ];
      args: [];
    },
    {
      name: "claimRewards";
      discriminator: [4, 144, 132, 71, 116, 23, 151, 80];
      accounts: [
        {
          name: "operator";
          writable: true;
          signer: true;
          relations: ["nodeState"];
        },
        {
          name: "nodeState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [110, 111, 100, 101];
              },
              {
                kind: "account";
                path: "operator";
              },
            ];
          };
        },
      ];
      args: [];
    },
    {
      name: "claimTask";
      discriminator: [49, 222, 219, 238, 155, 68, 221, 136];
      accounts: [
        {
          name: "worker";
          signer: true;
        },
        {
          name: "operator";
        },
        {
          name: "nodeState";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [110, 111, 100, 101];
              },
              {
                kind: "account";
                path: "operator";
              },
            ];
          };
        },
        {
          name: "task";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [116, 97, 115, 107];
              },
              {
                kind: "account";
                path: "task.task_id";
                account: "taskState";
              },
            ];
          };
        },
      ];
      args: [];
    },
    {
      name: "commitResult";
      discriminator: [45, 73, 224, 222, 48, 67, 191, 185];
      accounts: [
        {
          name: "worker";
          writable: true;
          signer: true;
        },
        {
          name: "operator";
        },
        {
          name: "nodeState";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [110, 111, 100, 101];
              },
              {
                kind: "account";
                path: "operator";
              },
            ];
          };
        },
        {
          name: "task";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [116, 97, 115, 107];
              },
              {
                kind: "account";
                path: "task.task_id";
                account: "taskState";
              },
            ];
          };
        },
        {
          name: "commitState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 109, 109, 105, 116];
              },
              {
                kind: "account";
                path: "task";
              },
              {
                kind: "account";
                path: "operator";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "commitment";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "reasoningHash";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "traceHash";
          type: {
            array: ["u8", 32];
          };
        },
      ];
    },
    {
      name: "createTask";
      discriminator: [194, 80, 6, 180, 232, 127, 48, 171];
      accounts: [
        {
          name: "creator";
          writable: true;
          signer: true;
        },
        {
          name: "protocol";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 116, 111, 99, 111, 108];
              },
            ];
          };
        },
        {
          name: "task";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [116, 97, 115, 107];
              },
              {
                kind: "arg";
                path: "taskId";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "taskId";
          type: "u64";
        },
        {
          name: "inputHash";
          type: {
            array: ["u8", 32];
          };
        },
        {
          name: "taskType";
          type: "u8";
        },
        {
          name: "tier";
          type: "u8";
        },
        {
          name: "reward";
          type: "u64";
        },
        {
          name: "validatorCount";
          type: "u8";
        },
      ];
    },
    {
      name: "deregisterNode";
      discriminator: [92, 177, 93, 30, 69, 177, 46, 177];
      accounts: [
        {
          name: "operator";
          signer: true;
          relations: ["nodeState"];
        },
        {
          name: "protocol";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 116, 111, 99, 111, 108];
              },
            ];
          };
        },
        {
          name: "nodeState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [110, 111, 100, 101];
              },
              {
                kind: "account";
                path: "operator";
              },
            ];
          };
        },
      ];
      args: [];
    },
    {
      name: "finalizeTask";
      discriminator: [126, 39, 210, 32, 77, 211, 27, 199];
      accounts: [
        {
          name: "caller";
          signer: true;
        },
        {
          name: "protocol";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 116, 111, 99, 111, 108];
              },
            ];
          };
        },
        {
          name: "task";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [116, 97, 115, 107];
              },
              {
                kind: "account";
                path: "task.task_id";
                account: "taskState";
              },
            ];
          };
        },
        {
          name: "workerNode";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [110, 111, 100, 101];
              },
              {
                kind: "account";
                path: "task.assigned_worker";
                account: "taskState";
              },
            ];
          };
        },
        {
          name: "workerCommit";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 109, 109, 105, 116];
              },
              {
                kind: "account";
                path: "task";
              },
              {
                kind: "account";
                path: "task.assigned_worker";
                account: "taskState";
              },
            ];
          };
        },
        {
          name: "creator";
          writable: true;
        },
        {
          name: "treasury";
          writable: true;
        },
      ];
      args: [];
    },
    {
      name: "initializeProtocol";
      discriminator: [188, 233, 252, 106, 134, 146, 202, 91];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "protocol";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 116, 111, 99, 111, 108];
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "treasury";
          type: "pubkey";
        },
      ];
    },
    {
      name: "registerNode";
      discriminator: [102, 85, 117, 114, 194, 188, 211, 168];
      accounts: [
        {
          name: "operator";
          writable: true;
          signer: true;
        },
        {
          name: "protocol";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 116, 111, 99, 111, 108];
              },
            ];
          };
        },
        {
          name: "nodeState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [110, 111, 100, 101];
              },
              {
                kind: "account";
                path: "operator";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "workerPubkey";
          type: "pubkey";
        },
        {
          name: "nodeType";
          type: "u8";
        },
        {
          name: "tier";
          type: "u8";
        },
      ];
    },
    {
      name: "depositStake";
      discriminator: [160, 167, 9, 220, 74, 243, 228, 43];
      accounts: [
        {
          name: "operator";
          writable: true;
          signer: true;
        },
        {
          name: "nodeState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [110, 111, 100, 101];
              },
              {
                kind: "account";
                path: "operator";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
      ];
    },
    {
      name: "revealResult";
      discriminator: [251, 165, 27, 86, 52, 234, 133, 173];
      accounts: [
        {
          name: "worker";
          signer: true;
        },
        {
          name: "operator";
        },
        {
          name: "nodeState";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [110, 111, 100, 101];
              },
              {
                kind: "account";
                path: "operator";
              },
            ];
          };
        },
        {
          name: "task";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [116, 97, 115, 107];
              },
              {
                kind: "account";
                path: "task.task_id";
                account: "taskState";
              },
            ];
          };
        },
        {
          name: "commitState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 109, 109, 105, 116];
              },
              {
                kind: "account";
                path: "task";
              },
              {
                kind: "account";
                path: "operator";
              },
            ];
          };
        },
      ];
      args: [
        {
          name: "verdict";
          type: "u8";
        },
        {
          name: "confidence";
          type: "u8";
        },
        {
          name: "salt";
          type: {
            array: ["u8", 32];
          };
        },
      ];
    },
    {
      name: "withdrawStake";
      discriminator: [153, 8, 22, 138, 105, 176, 87, 66];
      accounts: [
        {
          name: "operator";
          writable: true;
          signer: true;
          relations: ["nodeState"];
        },
        {
          name: "protocol";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 116, 111, 99, 111, 108];
              },
            ];
          };
        },
        {
          name: "nodeState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [110, 111, 100, 101];
              },
              {
                kind: "account";
                path: "operator";
              },
            ];
          };
        },
      ];
      args: [];
    },
    {
      name: "timeoutTask";
      discriminator: [89, 75, 167, 3, 58, 42, 159, 137];
      accounts: [
        { name: "caller"; writable: true; signer: true },
        {
          name: "task";
          writable: true;
          pda: {
            seeds: [
              { kind: "const"; value: [116, 97, 115, 107] },
              { kind: "account"; path: "task.task_id"; account: "taskState" },
            ];
          };
        },
        {
          name: "workerNode";
          writable: true;
          pda: {
            seeds: [
              { kind: "const"; value: [110, 111, 100, 101] },
              { kind: "account"; path: "task.assigned_worker"; account: "taskState" },
            ];
          };
        },
        { name: "creator"; writable: true },
      ];
      args: [];
    },
    {
      name: "resolveOptimisticTask";
      discriminator: [175, 191, 71, 197, 123, 249, 29, 187];
      accounts: [
        { name: "caller"; signer: true },
        {
          name: "protocol";
          writable: true;
          pda: { seeds: [{ kind: "const"; value: [112, 114, 111, 116, 111, 99, 111, 108] }] };
        },
        {
          name: "task";
          writable: true;
          pda: {
            seeds: [
              { kind: "const"; value: [116, 97, 115, 107] },
              { kind: "account"; path: "task.task_id"; account: "taskState" },
            ];
          };
        },
        {
          name: "workerNode";
          writable: true;
          pda: {
            seeds: [
              { kind: "const"; value: [110, 111, 100, 101] },
              { kind: "account"; path: "task.assigned_worker"; account: "taskState" },
            ];
          };
        },
        {
          name: "workerCommit";
          pda: {
            seeds: [
              { kind: "const"; value: [99, 111, 109, 109, 105, 116] },
              { kind: "account"; path: "task" },
              { kind: "account"; path: "task.assigned_worker"; account: "taskState" },
            ];
          };
        },
        { name: "creator"; writable: true },
        { name: "treasury"; writable: true },
      ];
      args: [];
    },
    {
      name: "requestWithdrawal";
      discriminator: [211, 228, 183, 131, 50, 23, 18, 110];
      accounts: [
        {
          name: "operator";
          writable: true;
          signer: true;
          relations: ["nodeState"];
        },
        {
          name: "nodeState";
          writable: true;
          pda: {
            seeds: [{ kind: "const"; value: [110, 111, 100, 101] }, { kind: "account"; path: "operator" }];
          };
        },
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
      ];
    },
    {
      name: "executeWithdrawal";
      discriminator: [251, 107, 50, 251, 146, 18, 152, 25];
      accounts: [
        {
          name: "operator";
          writable: true;
          signer: true;
          relations: ["nodeState"];
        },
        {
          name: "nodeState";
          writable: true;
          pda: {
            seeds: [{ kind: "const"; value: [110, 111, 100, 101] }, { kind: "account"; path: "operator" }];
          };
        },
      ];
      args: [];
    },
  ];
  accounts: [
    {
      name: "commitState";
      discriminator: [167, 0, 205, 156, 188, 170, 38, 201];
    },
    {
      name: "nodeState";
      discriminator: [8, 21, 101, 224, 245, 142, 157, 156];
    },
    {
      name: "protocolState";
      discriminator: [33, 51, 173, 134, 35, 140, 195, 248];
    },
    {
      name: "taskState";
      discriminator: [255, 33, 48, 249, 220, 80, 10, 9];
    },
  ];
  errors: [
    {
      code: 6000;
      name: "insufficientStake";
      msg: "Insufficient stake amount";
    },
    {
      code: 6001;
      name: "invalidTier";
      msg: "Invalid tier value";
    },
    {
      code: 6002;
      name: "nodeInCooldown";
      msg: "Node is in cooldown period";
    },
    {
      code: 6003;
      name: "cooldownNotComplete";
      msg: "Cooldown period has not completed";
    },
    {
      code: 6004;
      name: "taskNotOpen";
      msg: "Task is not in OPEN status";
    },
    {
      code: 6005;
      name: "taskNotClaimed";
      msg: "Task is not in CLAIMED status";
    },
    {
      code: 6006;
      name: "insufficientTier";
      msg: "Node tier is too low for this task";
    },
    {
      code: 6007;
      name: "workerOnly";
      msg: "Only Worker nodes can claim tasks";
    },
    {
      code: 6008;
      name: "commitDeadlinePassed";
      msg: "Commit deadline has passed";
    },
    {
      code: 6009;
      name: "revealDeadlinePassed";
      msg: "Reveal deadline has passed";
    },
    {
      code: 6010;
      name: "invalidReveal";
      msg: "Reveal does not match commitment";
    },
    {
      code: 6011;
      name: "taskNotFinalizable";
      msg: "Task is not ready for finalization";
    },
    {
      code: 6012;
      name: "noRewardsAvailable";
      msg: "No rewards available to claim";
    },
    {
      code: 6013;
      name: "unauthorized";
      msg: "Unauthorized access";
    },
    {
      code: 6014;
      name: "arithmeticOverflow";
      msg: "Arithmetic overflow";
    },
    {
      code: 6015;
      name: "invalidValidatorCount";
      msg: "Invalid validator count";
    },
    {
      code: 6016;
      name: "workerNotCommitted";
      msg: "Worker must commit before validators";
    },
    {
      code: 6017;
      name: "reputationTooLow";
      msg: "Node reputation too low";
    },
    {
      code: 6018;
      name: "taskNotRevealing";
      msg: "Task is not in REVEALING status";
    },
    {
      code: 6019;
      name: "alreadyRevealed";
      msg: "Already revealed";
    },
    {
      code: 6020;
      name: "invalidTaskId";
      msg: "Invalid task id";
    },
    {
      code: 6021;
      name: "workerNotAssigned";
      msg: "Worker not assigned to this task";
    },
    {
      code: 6022;
      name: "nodeNotActive";
      msg: "Node not active";
    },
    {
      code: 6023;
      name: "invalidRemainingAccounts";
      msg: "Invalid remaining accounts";
    },
    {
      code: 6024;
      name: "deadlineNotPassed";
      msg: "Deadline has not passed yet";
    },
    {
      code: 6025;
      name: "taskInvalidByNetwork";
      msg: "Task was invalidated by the network";
    },
    {
      code: 6026;
      name: "invalidAmount";
      msg: "Invalid amount for operation.";
    },
  ];
  types: [
    {
      name: "commitState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "task";
            type: "pubkey";
          },
          {
            name: "operator";
            type: "pubkey";
          },
          {
            name: "role";
            type: {
              defined: {
                name: "nodeType";
              };
            };
          },
          {
            name: "commitment";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "revealedVerdict";
            type: {
              defined: {
                name: "verdict";
              };
            };
          },
          {
            name: "revealedConfidence";
            type: "u8";
          },
          {
            name: "validationVote";
            type: {
              defined: {
                name: "validationVote";
              };
            };
          },
          {
            name: "reasoningHash";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "traceHash";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "committedAt";
            type: "i64";
          },
          {
            name: "revealedAt";
            type: "i64";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "nodeState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "operator";
            type: "pubkey";
          },
          {
            name: "nodeType";
            type: {
              defined: {
                name: "nodeType";
              };
            };
          },
          {
            name: "tier";
            type: "u8";
          },
          {
            name: "stake";
            type: "u64";
          },
          {
            name: "reputation";
            type: "u16";
          },
          {
            name: "tasksCompleted";
            type: "u32";
          },
          {
            name: "tasksFailed";
            type: "u32";
          },
          {
            name: "pendingRewards";
            type: "u64";
          },
          {
            name: "registeredAt";
            type: "i64";
          },
          {
            name: "cooldownStart";
            type: "i64";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "nodeType";
      type: {
        kind: "enum";
        variants: [
          {
            name: "worker";
          },
          {
            name: "validator";
          },
        ];
      };
    },
    {
      name: "protocolState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "taskCounter";
            type: "u64";
          },
          {
            name: "totalTasksCreated";
            type: "u64";
          },
          {
            name: "totalTasksCompleted";
            type: "u64";
          },
          {
            name: "activeWorkers";
            type: "u32";
          },
          {
            name: "activeValidators";
            type: "u32";
          },
          {
            name: "protocolFeeBps";
            type: "u16";
          },
          {
            name: "minWorkerStake";
            type: "u64";
          },
          {
            name: "minValidatorStake";
            type: "u64";
          },
          {
            name: "cooldownPeriod";
            type: "i64";
          },
          {
            name: "treasury";
            type: "pubkey";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "taskState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "taskId";
            type: "u64";
          },
          {
            name: "creator";
            type: "pubkey";
          },
          {
            name: "inputHash";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "taskType";
            type: {
              defined: {
                name: "taskType";
              };
            };
          },
          {
            name: "tier";
            type: "u8";
          },
          {
            name: "reward";
            type: "u64";
          },
          {
            name: "validatorCount";
            type: "u8";
          },
          {
            name: "status";
            type: {
              defined: {
                name: "taskStatus";
              };
            };
          },
          {
            name: "assignedWorker";
            type: "pubkey";
          },
          {
            name: "finalVerdict";
            type: {
              defined: {
                name: "verdict";
              };
            };
          },
          {
            name: "finalConfidence";
            type: "u8";
          },
          {
            name: "commitDeadline";
            type: "i64";
          },
          {
            name: "revealDeadline";
            type: "i64";
          },
          {
            name: "commitsReceived";
            type: "u8";
          },
          {
            name: "revealsReceived";
            type: "u8";
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "taskStatus";
      type: {
        kind: "enum";
        variants: [
          {
            name: "open";
          },
          {
            name: "claimed";
          },
          {
            name: "committed";
          },
          {
            name: "revealing";
          },
          {
            name: "completed";
          },
          {
            name: "disputed";
          },
          {
            name: "cancelled";
          },
        ];
      };
    },
    {
      name: "taskType";
      type: {
        kind: "enum";
        variants: [
          {
            name: "analyze";
          },
          {
            name: "simulate";
          },
          {
            name: "classify";
          },
          {
            name: "generate";
          },
        ];
      };
    },
    {
      name: "validationVote";
      type: {
        kind: "enum";
        variants: [
          {
            name: "unrevealed";
          },
          {
            name: "agree";
          },
          {
            name: "disagree";
          },
        ];
      };
    },
    {
      name: "verdict";
      type: {
        kind: "enum";
        variants: [
          {
            name: "none";
          },
          {
            name: "approved";
          },
          {
            name: "suspicious";
          },
          {
            name: "rejected";
          },
          {
            name: "error";
          },
        ];
      };
    },
  ];
};
