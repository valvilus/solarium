import { NextResponse } from "next/server";
import { stopContainer } from "@/lib/nodes/docker";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pubkey, role } = body;

    if (!pubkey || !role) {
      return NextResponse.json({ error: "Missing identity." }, { status: 400 });
    }

    await stopContainer(pubkey, role);

    return NextResponse.json({ success: true, message: "Daemon terminated." });
  } catch (error) {
    console.error("Terminate Error:", error);
    return NextResponse.json({ error: "Failed to terminate the container." }, { status: 500 });
  }
}
