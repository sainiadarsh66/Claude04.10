# Phase 8: Payments with Stripe (only if you charge money)

```
Read CLAUDE.md, docs/PRODUCT_BRIEF.md (Money section) and docs/SECURITY.md.
Build Phase 8 using Stripe in TEST mode. Plan first.

- Products and prices defined as config (not hard-coded in many places).
- Stripe Checkout for sign-up/upgrade, Stripe Customer Portal for managing
  plans, cards and invoices. We never see or store card numbers.
- Webhook endpoint (signature verified, idempotent: store processed event IDs)
  handling checkout.session.completed, customer.subscription.created/updated/deleted
  and invoice.payment_failed. Process webhooks via a BullMQ job.
- A `subscriptions` table; a single helper `getEntitlements(user)` that the API
  uses to gate paid features (server-side, never just hidden in the UI).
- Pricing page, billing settings page, and clear failed-payment messaging.
- Tests using Stripe test fixtures; instructions for using the Stripe CLI
  to forward webhooks locally.

Tell me which Stripe dashboard settings I must configure (tax, branding,
emails) and how to switch to live mode safely.
```
