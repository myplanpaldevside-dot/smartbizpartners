# SmartBiz Partners

**The all-in-one business management platform for Nigerian SMEs.**

Live at [smartbiz.team](https://smartbiz.team)

---

## What It Does

SmartBiz Partners gives small and medium businesses in Nigeria everything they need to run professionally — from invoicing to inventory to an online store — in one clean, fast app.

### Features

- **Invoices** — Create, send, and print branded invoices with sequential numbering and PDF export
- **Quotes** — Generate professional quotes and convert them to invoices in one click
- **Expenses** — Track business expenses by category
- **CRM** — Manage customers and auto-fill their details into invoices and quotes
- **Inventory** — Track stock levels and list items directly to your online store
- **Store** — Launch a public storefront with your own URL, accept orders and Paystack payments
- **Orders** — Manage and fulfill customer orders with status tracking
- **Reports** — Revenue, expenses, and profit summaries with date filters
- **AI Assistant** — Built-in business advisor chat
- **Admin Panel** — Platform-wide user and subscription overview (admin only)

### Auth

- Email/password sign-up with 14-day free trial
- Google sign-in

### Payments

Paystack integration for store checkout and subscription billing.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| UI | shadcn/ui, Tailwind CSS, Framer Motion |
| Backend | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| Payments | Paystack |
| Deployment | Lovable → GitHub → smartbiz.team |

---

## Local Development

```bash
# Clone
git clone https://github.com/myplanpaldevside-dot/smartbizpartners.git
cd smartbizpartners

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs on `http://localhost:8080` (or next available port).

You'll need a Supabase project with the schema from `supabase/combined_migration.sql` and the following Edge Functions deployed:

- `store-checkout` — Paystack payment init for store orders
- `paystack-checkout` — Subscription billing
- `paystack-webhook` — Paystack event handler
- `chat` — AI assistant
- `auth-email-hook` — Custom auth emails
- `process-email-queue` — Email sending

Required Supabase secrets: `paystack_API_KEY`, `LOVABLE_API_KEY`

---

## Deployment

Pushing to the `main` branch on GitHub triggers an automatic redeploy on Lovable → smartbiz.team.

```bash
git add .
git commit -m "your message"
git push origin main
```

---

## Project Structure

```
src/
  pages/
    smartbooks/       # All dashboard pages (Invoices, Quotes, Store, etc.)
    Storefront.tsx    # Public customer-facing store
    OrderSuccess.tsx  # Post-payment confirmation page
  components/
    smartbooks/       # Layout, sidebar, shared components
  hooks/
    useAuth.tsx       # Auth context with profile management
  integrations/
    supabase/         # Supabase client and generated types
supabase/
  functions/          # Deno Edge Functions
  migrations/         # SQL migration files
```
