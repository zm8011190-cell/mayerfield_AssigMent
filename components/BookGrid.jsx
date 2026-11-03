"use client";

import { useEffect, useState } from "react";
import { useFetch } from "@/lib/useFetch";
import BookCard from "./BookCard";
import CheckoutBar from "./CheckoutBar";

const filters = ["All", "Fiction", "Nonfiction", "Staff picks"];
const CART_STORAGE_KEY = "marginalia-books-cart";

export default function BookGrid() {
  const { data: books, error, loading } = useFetch("/api/books");
  const [filter, setFilter] = useState("All");
  const [quantities, setQuantities] = useState({});
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "{}");
      if (stored && typeof stored === "object" && !Array.isArray(stored)) {
        const validQuantities = Object.fromEntries(
          Object.entries(stored).filter(
            ([id, quantity]) =>
              /^\d+$/.test(id) &&
              Number(id) > 0 &&
              Number.isInteger(quantity) &&
              quantity > 0 &&
              quantity <= 9
          )
        );
        setQuantities(validQuantities);
      }
    } catch (err) {
      console.error("Could not restore the saved cart:", err);
    }
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(quantities));
    } catch (err) {
      console.error("Could not save the cart:", err);
    }
  }, [cartReady, quantities]);

  useEffect(() => {
    if (!books) return;
    const bookIds = new Set(books.map((book) => String(book.id)));
    setQuantities((current) =>
      Object.fromEntries(Object.entries(current).filter(([id]) => bookIds.has(id)))
    );
  }, [books]);

  const visibleBooks = (books ?? []).filter((book) => {
    if (filter === "All") return true;
    if (filter === "Staff picks") return book.staffPick;
    return book.category === filter;
  });

  // Everything with a quantity above 0 goes in the cart, even if the
  // current filter hides it.
  const cartLines = (books ?? [])
    .filter((book) => (quantities[book.id] ?? 0) > 0)
    .map((book) => ({
      bookId: book.id,
      quantity: quantities[book.id],
      priceCents: book.priceCents,
    }));

  function changeQuantity(id, next) {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, Math.min(9, next)) }));
  }

  return (
    <section
      id="catalog"
      aria-labelledby="catalog-title"
      className="mx-auto max-w-6xl border-t border-rule px-5 py-10 md:px-8 md:py-12"
    >
      <h2 id="catalog-title" className="mb-4 font-heading text-2xl md:text-3xl">
        The shelves
      </h2>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter books">
        {filters.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setFilter(name)}
            aria-pressed={filter === name}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              filter === name ? "border-ink bg-ink text-paper" : "border-rule bg-white hover:border-ink"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted">Loading books...</p>}
      {error && (
        <p role="alert" className="text-rust">
          Could not load books: {error}. Refresh to try again.
        </p>
      )}
      {!loading && !error && visibleBooks.length === 0 && (
        <p className="text-muted">No books match this filter yet.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {visibleBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            quantity={quantities[book.id] ?? 0}
            onQuantityChange={(next) => changeQuantity(book.id, next)}
          />
        ))}
      </div>

      <CheckoutBar cartLines={cartLines} />
    </section>
  );
}
