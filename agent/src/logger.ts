const SEPARATOR = "-".repeat(52);
const THICK_SEPARATOR = "=".repeat(52);

function timestamp(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

export function logHeader(title: string): void {
  console.info(THICK_SEPARATOR);
  console.info(`  [${timestamp()}]  ${title}`);
  console.info(THICK_SEPARATOR);
}

export function logStep(prefix: string, message: string): void {
  console.info(`  [${timestamp()}] [${prefix}] ${message}`);
}

export function logDivider(): void {
  console.info(SEPARATOR);
}

export function logKeyValue(key: string, value: string): void {
  console.info(`  [${timestamp()}]   ${key}: ${value}`);
}

export function logMetric(step: string, payload: Record<string, any>): void {
  console.info(`[POLYGON_METRIC] ${JSON.stringify({ step, ...payload })}`);
}
