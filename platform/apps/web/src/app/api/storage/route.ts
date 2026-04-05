import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const jsonString = JSON.stringify(data);
    const hashHex = crypto.createHash("sha256").update(jsonString).digest("hex");

    const storagePath = path.resolve(process.cwd(), "../../../agent/.storage", `${hashHex}.json`);

    await fs.mkdir(path.dirname(storagePath), { recursive: true });
    await fs.writeFile(storagePath, jsonString);

    const hashBytes = Array.from(Buffer.from(hashHex, "hex"));

    return NextResponse.json({
      success: true,
      hashHex,
      hashBytes,
    });
  } catch (err: any) {
    console.error("Storage upload failed", err);
    return NextResponse.json({ error: "Failed to upload to storage" }, { status: 500 });
  }
}
