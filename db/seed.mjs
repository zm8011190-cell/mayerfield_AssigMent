import "dotenv/config"; // must load before db.js reads DATABASE_URL
import { db } from "../lib/db.js";
import { books, events } from "./schema.js";

// The Week 2 hardcoded data, moved here. Run with: npm run db:seed
const bookRows = [
  { title: "The Salt Orchard", author: "Ines Marchetti", priceCents: 1800, category: "Fiction", staffPick: false, note: "", cover: "forest" },
  { title: "Letters to a Lighthouse", author: "Tomas Whitlock", priceCents: 1650, category: "Fiction", staffPick: false, note: "", cover: "plum" },
  { title: "Small Hours", author: "Adaeze Okoro", priceCents: 1700, category: "Fiction", staffPick: false, note: "", cover: "mustard" },
  { title: "A Field Guide to Quiet", author: "Marguerite Oyelaran", priceCents: 2200, category: "Nonfiction", staffPick: false, note: "", cover: "navy" },
  { title: "How Cities Remember", author: "Daniel Kowalczyk", priceCents: 2495, category: "Nonfiction", staffPick: false, note: "", cover: "rust" },
  { title: "The Bread Ledger", author: "Priya Venkataraman", priceCents: 2100, category: "Nonfiction", staffPick: false, note: "", cover: "forest" },
  { title: "Every Window Lit", author: "Noor Haddad", priceCents: 1900, category: "Fiction", staffPick: true, note: "I finished it in one sitting and started again. Sam, bookseller", cover: "plum" },
  { title: "The Last Good Map", author: "Hollis Brandt", priceCents: 2000, category: "Nonfiction", staffPick: true, note: "Our most hand-sold book this year. Jo, owner", cover: "navy" },
  { title: "Garden of Second Chances", author: "Leila Fontaine", priceCents: 1500, category: "Fiction", staffPick: true, note: "Perfect for a slow Sunday. Dee, bookseller", cover: "mustard" },
];

const eventRows = [
  { eventDate: "2026-11-12", title: "Reading: Ines Marchetti", description: "The author reads from The Salt Orchard, followed by questions and a signing. 7 pm." },
  { eventDate: "2026-11-19", title: "Thursday Book Club", description: "This month we discuss Small Hours. New members are welcome. 6:30 pm." },
  { eventDate: "2026-12-03", title: "Poetry Open Mic", description: "Bring a poem, yours or someone else's, and read it aloud. 7 pm." },
];

// Clear first so running the script twice does not create duplicates.
await db.delete(books);
await db.delete(events);
await db.insert(books).values(bookRows);
await db.insert(events).values(eventRows);

console.log(`Seeded ${bookRows.length} books and ${eventRows.length} events.`);
process.exit(0);
