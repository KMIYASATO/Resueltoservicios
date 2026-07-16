# Architecture

Resuelto uses a Supabase-centered architecture for the MVP.

```text
Browser
-> Next.js public web, customer area, professional area, admin area
-> Next.js Server Components
-> Route Handlers / Server Actions
-> Supabase Edge Functions for secrets and external integrations
-> PostgreSQL Functions for atomic business logic
-> Supabase PostgreSQL, Auth, RLS, Storage, Realtime
```

## Principles

- No FastAPI in the MVP.
- No `service_role` key in the browser.
- RLS remains enabled on exposed tables.
- Critical operations are validated server-side.
- Price, commission, payment state, booking state and roles are never trusted from the client.
- Webel is only a functional reference, not a source for code, texts, design or assets.

## Applications

- Public web: landing, category discovery, SEO pages.
- Customer web: search, compare, booking, messages, reviews.
- Professional portal: profile, services, coverage, availability, requests.
- Admin panel: catalog, verification, disputes, audit.

## Backend Layers

- PostgreSQL Functions: pricing, booking creation, availability locking, state transitions, commission calculation, cancellation, audit.
- Edge Functions: webhooks, email, notifications, signed URLs, sensitive admin actions.
- Route Handlers / Server Actions: session-aware web orchestration.

## Environments

- LOCAL
- DEVELOPMENT
- STAGING
- PRODUCTION

Each environment must use separate Supabase projects, keys, buckets and data.
