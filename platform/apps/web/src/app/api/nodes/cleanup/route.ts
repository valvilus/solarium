import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function POST(): Promise<NextResponse> {
  try {
    const result = execSync("docker ps -q --filter 'name=solarium-node-' | xargs -r docker rm -f", {
      encoding: "utf-8",
      timeout: 15000,
    }).trim();
    return NextResponse.json({ success: true, removed: result || "none" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as any).message }, { status: 500 });
  }
}
