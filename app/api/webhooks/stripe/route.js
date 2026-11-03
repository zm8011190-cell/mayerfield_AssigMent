import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { orders } from "@/db/schema";

export const dynamic = "force-dynamic";

// Stripe calls this route after a payment completes. It is the ONLY place
// an order is marked "paid". No login here: the signature proves it is Stripe.
export async function POST(request) {
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text(); // must be the raw text for the signature check

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature check failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      await db
        .update(orders)
        .set({ status: "paid" })
        .where(and(eq(orders.id, Number(session.metadata.orderId)), eq(orders.status, "pending")));
    }
  }

  return NextResponse.json({ received: true });
}
