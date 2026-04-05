import { NextResponse } from "next/server";
import { hashJson } from "@solarium-labs/sdk";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const hashArray = hashJson(data);
    const hashHex = Buffer.from(hashArray).toString("hex");

    const agentStorageDir = path.resolve(process.cwd(), "../../../agent/.storage");

    await fs.mkdir(agentStorageDir, { recursive: true });
    await fs.writeFile(path.join(agentStorageDir, `${hashHex}.json`), JSON.stringify(data));

    return NextResponse.json({
      uri: `local://${hashHex}`,
      hashArray,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
