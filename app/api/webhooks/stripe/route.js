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

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded" ||
    event.type === "checkout.session.async_payment_failed" ||
    event.type === "checkout.session.expired"
  ) {
    const session = event.data.object;
    const orderId = Number(session.metadata?.orderId);
    if (Number.isSafeInteger(orderId) && orderId > 0) {
      const status =
        event.type === "checkout.session.expired" ||
        event.type === "checkout.session.async_payment_failed"
          ? "failed"
          : session.payment_status === "paid"
            ? "paid"
            : null;

      if (status) {
        await db
          .update(orders)
          .set({ status })
          .where(
            and(
              eq(orders.id, orderId),
              eq(orders.stripeSessionId, session.id),
              eq(orders.status, "pending")
            )
          );
      }
    }
  }

  return NextResponse.json({ received: true });
}
