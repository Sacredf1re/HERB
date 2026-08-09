# Wildroot & Co. — herbal e-commerce starter

A small-batch herbal goods storefront: product catalog with images, accounts
(sign up / sign in), coupons, and customer reviews you can edit or remove as
the admin. Built with Next.js (App Router), Prisma, PostgreSQL, and NextAuth.
Styled after a soft, boutique-botanical look (think Herbivore Botanicals),
not any single site's exact design.

Checkout is wired up end-to-end **except a real payment gateway** — placing
an order records it as "pending payment" in the database. When you pick a
provider (Stripe, PayPal, Mercado Pago, etc.) the only change needed is
inside `app/checkout/page.jsx` and `app/api/orders/route.js`; everything
else (cart, coupons, order history) already works.

## Features

- **Catalog** — products with multiple images, category filters, product detail pages
- **Accounts** — email/password sign up and sign in (NextAuth + bcrypt), order history under "Account"
- **Coupons** — percent or fixed-amount, minimum subtotal, expiry date, on/off toggle — manage from `/admin/coupons`
- **Reviews** — any signed-in customer can leave a star rating + comment; you (the admin) can edit or delete any review from `/admin/reviews`
- **Admin dashboard** at `/admin` — protected by middleware, only accounts with the `ADMIN` role can enter

## Project structure

```
app/                 Pages and API routes (Next.js App Router)
  admin/              Admin dashboard, product/coupon/review management
  api/                 REST-ish API routes used by the client components
  products/            Storefront catalog + product detail
  cart/, checkout/      Cart and stub checkout
components/          Shared UI (Navbar, ProductCard, review form, etc.)
context/             Client-side cart state (localStorage-backed)
lib/                 Prisma client, NextAuth config, formatting helpers
prisma/schema.prisma Database schema
prisma/seed.js       Placeholder brand name + 9 placeholder products
```

## 1. Local setup

You'll need Node.js 18+ and a PostgreSQL database (a free one from
[Render](https://render.com), [Neon](https://neon.tech), or a local Postgres
install all work).

```bash
npm install
cp .env.example .env
# edit .env: set DATABASE_URL to your Postgres connection string
#            set NEXTAUTH_SECRET to a random string (openssl rand -base64 32)

npx prisma db push     # creates the tables
npm run db:seed        # loads the brand placeholder products + an admin user
npm run dev
```

Visit `http://localhost:3000`. Sign in at `/login` with the seeded admin:

```
admin@wildroot.test / Admin123!
```

**Change that password (or delete the seeded admin and create your own)
before this ever goes live.** The simplest way: sign up a normal account,
then use `npx prisma studio` to flip its `role` to `ADMIN` and delete the
placeholder admin row.

## 2. Deploying to Render

### Option A — Blueprint (fastest)

1. Push this project to a GitHub repository.
2. In Render, choose **New > Blueprint** and point it at your repo. Render
   will read `render.yaml` and provision both the web service and a free
   Postgres database automatically.
3. Once the first deploy finishes, open the web service's **Shell** tab and run:
   ```bash
   npm run db:seed
   ```
4. Set `NEXTAUTH_URL` in the service's Environment tab to your Render URL
   (e.g. `https://wildroot-shop.onrender.com`), then redeploy.

### Option B — Manual

1. **New > PostgreSQL** — create a free database, copy its **Internal
   Database URL**.
2. **New > Web Service** — connect your repo.
   - Build command: `npm install && npx prisma db push && npm run build`
   - Start command: `npm start`
   - Add environment variables: `DATABASE_URL` (from step 1),
     `NEXTAUTH_SECRET` (any long random string), `NEXTAUTH_URL` (your
     Render URL once it's assigned).
3. After the first successful deploy, open the **Shell** tab and run
   `npm run db:seed`.

### Connecting your own domain

Once the service is live on its `onrender.com` URL:

1. In the web service, go to **Settings > Custom Domain** and add your domain.
2. Render shows you a CNAME (or A record) target — add that record at your
   domain registrar (Namecheap, GoDaddy, Google Domains, etc.).
3. Render issues a free TLS certificate automatically once DNS propagates
   (usually a few minutes to a couple of hours).
4. Update `NEXTAUTH_URL` to your real domain (`https://yourdomain.com`) and
   redeploy — NextAuth needs this to match exactly or sign-in will break.

## 3. Replacing the placeholders

- **Brand name & colors** — search for "Wildroot" across `app/` and
  `components/`; colors live in `tailwind.config.js`.
- **Products** — either edit them from `/admin/products`, or edit the
  `products` array in `prisma/seed.js` and re-run `npm run db:seed`.
- **Product photos** — the seed data uses placeholder images from
  picsum.photos. Replace the `images` field (comma-separated URLs) per
  product from the admin edit page once you have real photos hosted
  somewhere (Cloudinary, S3, Render disk, etc.).
- **Payment gateway** — see the note at the top of this file.
