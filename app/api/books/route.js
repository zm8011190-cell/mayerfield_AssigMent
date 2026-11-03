import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { books } from "@/db/schema";

export const dynamic = "force-dynamic"; // always read the live database

export async function GET() {
  try {
    const rows = await db.select().from(books).orderBy(books.id);
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not load books" }, { status: 500 });
  }
}
