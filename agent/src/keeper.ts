import { BN } from "@coral-xyz/anchor";
import { SolariumClient } from "@solarium-labs/sdk";
import { ChainContext } from "./chain";
import { findTasksByStatus, sleep } from "./tasks";
import { logStep, logHeader, logDivider, logKeyValue } from "./logger";

const POLL_INTERVAL_MS = 10_000;

export async function processKeeperLoop(ctx: ChainContext): Promise<void> {
  const { client } = ctx;
  logHeader("KEEPER NODE ACTIVE");
  logStep("MODE", "Scraping blockchain for resolvable tasks");
  logDivider();

  while (true) {
    try {
      const now = Math.floor(Date.now() / 1000);
      const revealing = await findTasksByStatus(client, "revealing");
      for (const t of revealing) {
        if (now >= t.account.revealDeadline.toNumber()) {
          logStep("FINALIZE", `Finalizing Revealed Task ${t.account.taskId.toString()}`);
          try {
            const sig = await client.finalizeTask(t.account.taskId);
            logKeyValue("Success", `Tx: ${sig.slice(0, 16)}...`);
          } catch (e: any) {
            logKeyValue("Error", e.message);
          }
        }
      }

      const optimisticFinalized = await findTasksByStatus(client, "optimisticFinalized");
      for (const t of optimisticFinalized) {
        const windowEnd = t.account.optimisticFinalityTimestamp.toNumber() + 300;
        if (now >= windowEnd) {
          logStep("RESOLVE", `Resolving OptimisticFinalized Task ${t.account.taskId.toString()}`);
          try {
            const sig = await client.resolveOptimisticTask(t.account.taskId);
            logKeyValue("Success", `Tx: ${sig.slice(0, 16)}...`);
          } catch (e: any) {
            logKeyValue("Error", e.message);
          }
        }
      }
      const claimed = await findTasksByStatus(client, "claimed");
      const committed = await findTasksByStatus(client, "committed");

      for (const t of [...claimed, ...committed]) {
        if (t.account.commitDeadline.toNumber() < now) {
          logStep("TIMEOUT", `Slashing deadlocked Task ${t.account.taskId.toString()}`);
          try {
            const sig = await client.timeoutTask(t.account.taskId);
            logKeyValue("Success", `Tx: ${sig.slice(0, 16)}...`);
          } catch (e: any) {
            logKeyValue("Error", e.message);
          }
        }
      }
    } catch (err: unknown) {
      logStep("ERROR", err instanceof Error ? err.message : String(err));
    }
    await sleep(POLL_INTERVAL_MS);
  }
}
