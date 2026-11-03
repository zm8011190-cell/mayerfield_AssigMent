import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(events).orderBy(events.eventDate);
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not load events" }, { status: 500 });
  }
}
