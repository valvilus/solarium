export type TaskType = "verify_price" | "audit_code" | "assess_image" | "generic_string";

export interface TaskManifest {
  version: "1.0";
  title: string;
  type: TaskType;
  inputData: unknown;
  workerPrompt: string;
  validatorPrompt: string;
  expectedSchema: object;
}

export interface WorkerReport {
  taskId: string;
  manifestUri: string;
  workerAddress: string;
  output: Record<string, unknown>;
  zkTlsProof?: string;
}

export function buildManifest(
  title: string,
  type: TaskType,
  inputData: unknown,
  workerPrompt: string,
  validatorPrompt: string,
  expectedSchema: object
): TaskManifest {
  return {
    version: "1.0",
    title,
    type,
    inputData,
    workerPrompt,
    validatorPrompt,
    expectedSchema,
  };
}

export function buildWorkerReport(
  taskId: string,
  manifestUri: string,
  workerAddress: string,
  output: Record<string, unknown>,
  zkTlsProof?: string
): WorkerReport {
  return {
    taskId,
    manifestUri,
    workerAddress,
    output,
    zkTlsProof,
  };
}
