import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { SolariumClient, deriveTaskPda, deriveCommitPda } from "@solarium-labs/sdk";

const STATUS_POLL_MS = 3_000;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function statusIs(status: object, name: string): boolean {
  return JSON.stringify(status).includes(name);
}

export async function findTasksByStatus(client: SolariumClient, statusName: string): Promise<any[]> {
  const all = await client.program.account.taskState.all();
  return all
    .filter((t) => statusIs(t.account.status, statusName))
    .sort((a, b) => b.account.taskId.cmp(a.account.taskId));
}

export async function waitForRevealPhase(client: SolariumClient, taskId: BN): Promise<void> {
  console.info(`Waiting for task ${taskId.toString()} to enter Revealing...`);
  while (true) {
    const task = await client.fetchTask(taskId);
    if (statusIs(task.status, "revealing")) {
      console.info(`Task ${taskId.toString()} is now Revealing`);
      return;
    }
    await sleep(STATUS_POLL_MS);
  }
}

export async function hasAlreadyCommitted(client: SolariumClient, taskId: BN): Promise<boolean> {
  try {
    const [taskPda] = deriveTaskPda(taskId, client.programId);
    const [commitPda] = deriveCommitPda(taskPda, client.walletKey, client.programId);
    await client.program.account.commitState.fetch(commitPda);
    return true;
  } catch {
    return false;
  }
}
