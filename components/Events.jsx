"use client";

import { useFetch } from "@/lib/useFetch";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Events() {
  const { data: events, error, loading } = useFetch("/api/events");

  return (
    <section
      id="events"
      aria-labelledby="events-title"
      className="mx-auto max-w-6xl border-t border-rule px-5 py-10 md:px-8 md:py-12"
    >
      <h2 id="events-title" className="mb-6 font-heading text-2xl md:text-3xl">
        Readings and book clubs
      </h2>

      {loading && <p className="text-muted">Loading events...</p>}
      {error && (
        <p role="alert" className="text-rust">
          Could not load events: {error}.
        </p>
      )}

      <ul className="flex max-w-2xl flex-col gap-4">
        {(events ?? []).map((event) => {
          // eventDate arrives as "YYYY-MM-DD"
          const [, month, day] = event.eventDate.split("-");
          return (
            <li key={event.id} className="flex items-start gap-5">
              <time
                dateTime={event.eventDate}
                className="w-18 shrink-0 rounded bg-ink py-2 text-center leading-tight text-paper"
              >
                <strong className="block font-heading text-3xl">{Number(day)}</strong>
                {months[Number(month) - 1]}
              </time>
              <div className="min-w-0">
                <h3 className="mb-1 font-heading text-lg">{event.title}</h3>
                <p className="text-muted">{event.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
