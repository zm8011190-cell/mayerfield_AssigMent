"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const MAX_TRIES = 5;
const WAIT_MS = 2000;

export default function OrderStatus({ orderId }) {
  const [order, setOrder] = useState(null);
  // checking | paid | pending | failed | signin | error
  const [state, setState] = useState(orderId ? "checking" : "error");

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let timer;
    let tries = 0;

    // The webhook can arrive a moment after the redirect, so ask a few times.
    async function check() {
      tries += 1;
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.status === 401) {
          if (!cancelled) setState("signin");
          return;
        }
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (cancelled) return;
        setOrder(data);
        if (data.status === "paid") {
          setState("paid");
        } else if (data.status === "failed") {
          setState("failed");
        } else if (tries >= MAX_TRIES) {
          setState("pending");
        } else {
          timer = setTimeout(check, WAIT_MS);
        }
      } catch {
        if (!cancelled) setState("error");
      }
    }

    check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId]);

  useEffect(() => {
    if (state !== "paid") return;
    try {
      window.localStorage.removeItem("marginalia-books-cart");
    } catch (err) {
      console.error("Could not clear the completed order from the cart:", err);
    }
  }, [state]);

  return (
    <section className="mx-auto max-w-xl px-5 py-12 md:py-16">
      {state === "checking" && <p className="text-muted">Confirming your payment...</p>}

      {state === "paid" && order && (
        <>
          <h1 className="mb-2 font-heading text-3xl">Thank you, your order is paid.</h1>
          <p className="mb-6 text-muted">Order number {order.id}</p>
          <ul className="mb-4 flex flex-col gap-2 border-y border-rule py-4">
            {order.items.map((item) => (
              <li key={item.title} className="flex justify-between gap-4">
                <span className="min-w-0">
                  {item.quantity} x {item.title}
                </span>
                <span>${((item.unitPriceCents * item.quantity) / 100).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="mb-8 text-right font-semibold">Total ${(order.totalCents / 100).toFixed(2)}</p>
        </>
      )}

      {state === "pending" && (
        <>
          <h1 className="mb-2 font-heading text-3xl">Still confirming</h1>
          <p className="mb-8 text-muted">
            Your payment has not been confirmed yet. Refresh this page in a moment.
          </p>
        </>
      )}

      {state === "failed" && (
        <>
          <h1 className="mb-2 font-heading text-3xl">Payment not completed</h1>
          <p className="mb-8 text-muted">
            This order was not paid. Your cart is still available if you would like to try again.
          </p>
        </>
      )}

      {state === "signin" && (
        <>
          <h1 className="mb-2 font-heading text-3xl">Please sign in</h1>
          <p className="mb-4 text-muted">Sign in to see your order.</p>
          <Link
            href={`/login?callbackURL=${encodeURIComponent(`/success?order_id=${orderId}`)}`}
            className="mb-8 inline-block rounded bg-ink px-6 py-3 font-semibold text-paper hover:bg-plum"
          >
            Sign in to view order
          </Link>
        </>
      )}

      {state === "error" && (
        <>
          <h1 className="mb-2 font-heading text-3xl">We could not find that order</h1>
          <p className="mb-8 text-muted">Check the link or try again.</p>
        </>
      )}

      <Link href="/" className="inline-block rounded bg-ink px-6 py-3 font-semibold text-paper hover:bg-plum">
        Back to the shop
      </Link>
    </section>
  );
}
