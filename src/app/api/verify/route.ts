import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/onchain";

export const dynamic = "force-dynamic";

/** GET /api/verify?address=0x… — checks a token against Robinhood's stock token beacon. */
export async function GET(request: Request) {
  const address = new URL(request.url).searchParams.get("address") ?? "";
  const verdict = await verifyToken(address);
  return NextResponse.json(verdict, { headers: { "cache-control": "no-store" } });
}
