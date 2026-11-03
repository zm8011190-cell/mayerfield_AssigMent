# Marginalia Books

Marginalia Books is a full-stack storefront for an independent bookstore. Visitors can browse a live book catalog, filter by category or staff picks, choose quantities, and explore upcoming readings and book-club events. Customers can create an account, sign in, pay through Stripe Checkout, and view the status and contents of their own orders.

## Features

- Responsive bookstore storefront with book categories, staff recommendations, event listings, and visit information.
- Email-and-password sign-up, sign-in, session display, and sign-out using Better Auth.
- PostgreSQL-backed books, events, accounts, orders, and order items, accessed with Drizzle ORM.
- Server-priced checkout: the API accepts book IDs and quantities, then looks up prices in the database before creating the Stripe Checkout Session.
- Stripe webhook verification and payment status updates; order status is not set to paid by the browser.
- Order details are available only to the signed-in customer who placed the order.
- Seed data for nine books and three bookstore events.

## Tech stack

- Next.js App Router, React, and Tailwind CSS 4
- Better Auth
- PostgreSQL, Drizzle ORM, and Drizzle Kit
- Stripe Checkout and webhooks

## Requirements

- Node.js 20.9 or later and npm
- A PostgreSQL database
- A Stripe account with test-mode API keys for local development

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set the database URL, a unique Better Auth secret, the app URL, and Stripe test keys:

   ```env
   DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
   BETTER_AUTH_SECRET=<a unique secret, at least 32 characters>
   BETTER_AUTH_URL=http://localhost:3000
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

   Generate a secret with `openssl rand -base64 32`. Never commit `.env` or use live Stripe keys for local development.

3. Generate the Better Auth database schema. This replaces the placeholder in `db/auth-schema.js` with the auth tables used by the app:

   ```bash
   npm run auth:generate
   ```

4. Generate and apply the database migrations, then insert the sample catalog and events:

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. In another terminal, forward Stripe test webhooks to the local app and use the webhook signing secret printed by Stripe CLI as `STRIPE_WEBHOOK_SECRET`:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## API routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/books` | Returns the book catalog from PostgreSQL. |
| `GET` | `/api/events` | Returns bookstore events ordered by date. |
| `POST` | `/api/checkout` | Requires a signed-in user; validates the cart, recalculates prices from the database, creates a pending order, and returns a Stripe Checkout URL. |
| `POST` | `/api/webhooks/stripe` | Verifies Stripe's signature and marks a pending order paid when checkout completes. |
| `GET` | `/api/orders/:id` | Requires the order's owner to be signed in and returns that order and its items. |
| `GET`, `POST` | `/api/auth/[...all]` | Better Auth session and email/password authentication endpoints. |

## Project layout

```text
app/          App Router pages and API handlers
components/   Storefront, catalog, events, checkout, and order UI
db/           Drizzle schemas and catalog/event seed data
lib/          Database, auth, Stripe, session, and fetch helpers
```

The shopping cart is held in page state and is not persisted across reloads. The checkout total displayed in the browser is informational; the server calculates the amount used for payment from the database.
