import { NextResponse } from "next/server";
import { sha256 } from "js-sha256";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const jsonString = JSON.stringify(body);
    const hashHex = sha256(jsonString);
    const hashBytes = [];
    for (let i = 0; i < hashHex.length; i += 2) {
      hashBytes.push(parseInt(hashHex.substring(i, i + 2), 16));
    }

    const storageDir = path.resolve(process.cwd(), "../../../agent/.storage");
    await fs.mkdir(storageDir, { recursive: true });
    await fs.writeFile(path.join(storageDir, `${hashHex}.json`), jsonString);

    return NextResponse.json({
      success: true,
      uri: `local://${hashHex}`,
      hashArray: hashBytes,
    });
  } catch (error) {
    console.error("Storage Error:", error);
    return NextResponse.json({ error: (error as any).message }, { status: 500 });
  }
}
