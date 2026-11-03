import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/session";
import { books, orders, orderItems } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request) {
  // 1. Login check: every order must belong to a real user.
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to check out" }, { status: 401 });
  }

  // 2. Read only book ids and quantities from the browser. Never prices.
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const wanted = new Map(); // bookId -> quantity
  for (const item of Array.isArray(body.items) ? body.items : []) {
    const bookId = Number(item.bookId);
    const quantity = Number(item.quantity);
    if (!Number.isInteger(bookId) || !Number.isInteger(quantity)) continue;
    if (quantity < 1 || quantity > 9) continue;
    wanted.set(bookId, quantity);
  }
  if (wanted.size === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  // 3. Look up the real prices in our database.
  const rows = await db.select().from(books).where(inArray(books.id, [...wanted.keys()]));
  if (rows.length !== wanted.size) {
    return NextResponse.json({ error: "Unknown book in cart" }, { status: 400 });
  }
  const totalCents = rows.reduce((sum, book) => sum + book.priceCents * wanted.get(book.id), 0);

  // 4. Create the order and its items together, or neither.
  const order = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(orders)
      .values({ userId: user.id, status: "pending", totalCents })
      .returning();
    await tx.insert(orderItems).values(
      rows.map((book) => ({
        orderId: created.id,
        bookId: book.id,
        quantity: wanted.get(book.id),
        unitPriceCents: book.priceCents,
      }))
    );
    return created;
  });

  // 5. Start the Stripe Checkout Session using the database prices.
  const baseUrl = process.env.BETTER_AUTH_URL;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items: rows.map((book) => ({
        quantity: wanted.get(book.id),
        price_data: {
          currency: "usd",
          unit_amount: book.priceCents,
          product_data: { name: book.title, description: `by ${book.author}` },
        },
      })),
      metadata: { orderId: String(order.id) },
      success_url: `${baseUrl}/success?order_id=${order.id}`,
      cancel_url: `${baseUrl}/#catalog`,
    });
    await db.update(orders).set({ stripeSessionId: session.id }).where(eq(orders.id, order.id));
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    await db.update(orders).set({ status: "failed" }).where(eq(orders.id, order.id));
    return NextResponse.json({ error: "Could not start checkout" }, { status: 502 });
  }
}
