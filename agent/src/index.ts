import "dotenv/config";
import { loadConfig } from "./config";
import { initChain } from "./chain";
import { startWorkerLoop } from "./worker";
import { startValidatorLoop } from "./validator";
import { processKeeperLoop } from "./keeper";
import { BN } from "@coral-xyz/anchor";
import { logStep, logKeyValue, logHeader } from "./logger";

const VERSION = "0.1.0";

function printBanner(role: string, tier: number): void {
  const line = "=".repeat(42);
  console.info(line);
  console.info("  SOLARIUM AGENT NODE");
  console.info(`  Version: ${VERSION}`);
  console.info(`  Role:    ${role.toUpperCase()}`);
  console.info(`  Tier:    ${tier}`);
  console.info(line);
}

async function main(): Promise<void> {
  const config = loadConfig();
  printBanner(config.nodeRole, config.nodeTier);

  const ctx = await initChain(config);

  if (await handleWithdrawalOptions(ctx)) {
    return;
  }

  if (config.nodeRole === "worker") {
    await startWorkerLoop(ctx, config);
  } else if (config.nodeRole === "validator") {
    await startValidatorLoop(ctx, config);
  } else if (config.nodeRole === "keeper") {
    await processKeeperLoop(ctx);
  } else {
    throw new Error(`Unknown role: ${config.nodeRole}`);
  }
}

async function handleWithdrawalOptions(ctx: Awaited<ReturnType<typeof initChain>>): Promise<boolean> {
  const arg = process.argv[2];
  if (arg === "withdraw:request") {
    logHeader("WITHDRAWAL REQUEST");
    const amountNum = parseFloat(process.argv[3]);
    if (isNaN(amountNum) || amountNum <= 0) {
      console.error("Usage: pnpm start withdraw:request <amount_lamports>");
      process.exit(1);
    }
    const amount = new BN(amountNum);
    logStep("TX", `Requesting withdrawal of ${amount.toString()} lamports...`);
    const sig = await ctx.client.requestWithdrawal(amount);
    logKeyValue("Success", `Tx: ${sig}`);
    return true;
  } else if (arg === "withdraw:execute") {
    logHeader("WITHDRAWAL EXECUTE");
    logStep("TX", "Executing withdrawal from queue...");
    const sig = await ctx.client.executeWithdrawal();
    logKeyValue("Success", `Tx: ${sig}`);
    return true;
  }
  return false;
}

main().catch((err: unknown) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
