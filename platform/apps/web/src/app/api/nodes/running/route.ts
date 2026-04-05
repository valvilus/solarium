import { NextResponse } from "next/server";
import { execSync } from "child_process";

type ContainerInfo = {
  readonly containerName: string;
  readonly role: string;
  readonly operatorPubkey: string;
};

function inspectContainer(name: string): ContainerInfo | null {
  try {
    const raw = execSync(`docker inspect ${name} --format '{{range .Config.Env}}{{println .}}{{end}}'`, {
      encoding: "utf-8",
      timeout: 3000,
    });

    const envMap: Record<string, string> = {};
    for (const line of raw.split("\n")) {
      const idx = line.indexOf("=");
      if (idx === -1) continue;
      envMap[line.slice(0, idx)] = line.slice(idx + 1).trim();
    }

    return {
      containerName: name,
      role: envMap["NODE_ROLE"] || "worker",
      operatorPubkey: envMap["REWARD_RECEIVER"] || "",
    };
  } catch {
    return null;
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const output = execSync("docker ps --filter 'name=solarium-node-' --format '{{.Names}}'", {
      encoding: "utf-8",
      timeout: 5000,
    }).trim();

    if (!output) return NextResponse.json({ containers: [] });

    const names = output.split("\n").filter(Boolean);
    const containers = names.map(inspectContainer).filter(Boolean) as ContainerInfo[];

    return NextResponse.json({ containers });
  } catch {
    return NextResponse.json({ containers: [] });
  }
}
