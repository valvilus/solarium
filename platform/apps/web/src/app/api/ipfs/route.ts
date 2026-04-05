import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const jsonString = JSON.stringify(data);
    const hashHex = crypto.createHash("sha256").update(jsonString).digest("hex");

    const projectRoot = path.resolve(process.cwd(), "../../../");
    const storageDir = path.join(projectRoot, "agent", ".storage");

    await fs.mkdir(storageDir, { recursive: true });

    const filePath = path.join(storageDir, `${hashHex}.json`);
    await fs.writeFile(filePath, jsonString, "utf-8");

    return NextResponse.json({
      success: true,
      uri: `local://${hashHex}`,
      hashHex: hashHex,
    });
  } catch (error: any) {
    console.error("IPFS Mock Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
