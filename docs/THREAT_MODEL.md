# Threat Model

## Main Risks

- IDOR across bookings, messages and addresses.
- Role escalation by modifying profile data.
- Manipulated booking price, commission or payment state.
- Double booking caused by concurrency.
- Public exposure of professional documents.
- Fake payment webhook or replayed webhook.
- Secrets committed to repository or exposed in browser.
- Overbroad RLS policies.

## Controls

- RLS on every exposed table.
- Backend-only state transitions.
- PostgreSQL transactions for booking creation.
- Idempotency keys for critical operations.
- Signed and verified webhooks.
- Private buckets for documents and evidence.
- Audit trail for sensitive operations.
- Strict environment separation.
