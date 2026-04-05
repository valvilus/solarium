import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(req: Request, { params }: { params: { hash: string } }) {
  try {
    const hash = params.hash;

    if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
      return NextResponse.json({ error: "Invalid hash format" }, { status: 400 });
    }

    const storagePath = path.resolve(process.cwd(), "../../../agent/.storage", `${hash}.json`);

    const content = await fs.readFile(storagePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return NextResponse.json({ error: "Storage file not found locally" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to read storage" }, { status: 500 });
  }
}
