"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

// cartLines: [{ bookId, quantity, priceCents }]. The total shown here is
// only for display. The server recalculates it from the database.
export default function CheckoutBar({ cartLines }) {
  const { data: session } = authClient.useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const count = cartLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalCents = cartLines.reduce((sum, line) => sum + line.quantity * line.priceCents, 0);

  async function handleOrder() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartLines.map((line) => ({ bookId: line.bookId, quantity: line.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url; // off to Stripe's hosted page
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  if (count === 0) return null;

  return (
    <div className="sticky bottom-0 mt-8 flex flex-wrap items-center justify-between gap-3 rounded border border-rule bg-white px-4 py-3 shadow-md">
      <p className="font-semibold">
        {count} {count === 1 ? "book" : "books"}, ${(totalCents / 100).toFixed(2)}
      </p>
      {session ? (
        <button
          type="button"
          onClick={handleOrder}
          disabled={busy}
          className="rounded bg-ink px-6 py-2 font-semibold text-paper hover:bg-plum disabled:opacity-50"
        >
          {busy ? "Opening checkout" : "Order now"}
        </button>
      ) : (
        <Link href="/login" className="rounded bg-ink px-6 py-2 font-semibold text-paper hover:bg-plum">
          Sign in to order
        </Link>
      )}
      {error && (
        <p role="alert" className="w-full text-rust">
          {error}
        </p>
      )}
    </div>
  );
}
