import { spawn } from "child_process";
import { generateContainerName } from "@/lib/nodes/docker";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pubkey = searchParams.get("pubkey");
  const role = searchParams.get("role") as "worker" | "validator";

  if (!pubkey || !role) {
    return new Response("Missing parameters", { status: 400 });
  }

  const containerName = generateContainerName(pubkey, role);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let isClosed = false;

      const proc = spawn("docker", ["logs", "-f", "--tail", "25", containerName]);

      let bufferStr = "";
      const pump = (data: Buffer) => {
        if (isClosed) return;
        bufferStr += data.toString("utf-8");
        const lines = bufferStr.split("\n");

        bufferStr = lines.pop() || "";

        for (const line of lines) {
          if (line.trim()) {
            const payload = JSON.stringify({ text: line.trim() });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }
        }
      };

      proc.stdout.on("data", pump);
      proc.stderr.on("data", pump);

      proc.on("close", () => {
        if (!isClosed) {
          if (bufferStr.trim()) {
            const payload = JSON.stringify({ text: bufferStr.trim() });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: "[SYSTEM] Daemon detached or container terminated." })}\n\n`)
          );
          controller.close();
          isClosed = true;
        }
      });

      req.signal.addEventListener("abort", () => {
        if (!isClosed) {
          proc.kill();
          controller.close();
          isClosed = true;
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
