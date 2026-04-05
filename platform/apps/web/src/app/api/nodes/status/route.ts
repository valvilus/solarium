import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { generateContainerName } from "@/lib/nodes/docker";

const execAsync = promisify(exec);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pubkey = searchParams.get("pubkey");
  const role = searchParams.get("role") as "worker" | "validator";

  if (!pubkey || !role) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const containerName = generateContainerName(pubkey, role);

  try {
    const { stdout } = await execAsync(`docker ps -q -f name=${containerName}`);
    if (stdout.trim().length > 0) {
      return NextResponse.json({ status: "running" });
    }
    return NextResponse.json({ status: "idle" });
  } catch (err) {
    return NextResponse.json({ status: "idle" });
  }
}
