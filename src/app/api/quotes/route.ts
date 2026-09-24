import { NextResponse } from "next/server";
import { getQuotes } from "@/lib/quotes";

export const dynamic = "force-dynamic";

export async function GET() {
  const quotes = await getQuotes();
  return NextResponse.json({ quotes }, { headers: { "cache-control": "public, max-age=60" } });
}
