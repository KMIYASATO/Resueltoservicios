# Security

## Rules

- Do not expose private keys in frontend.
- Do not use `service_role` in browser code.
- Do not disable RLS to bypass errors.
- Do not trust client-provided role, price, commission or booking state.
- Do not log passwords, tokens, complete card data or secrets.

## Web Security Headers

Configure in Next.js before deployment:

- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- frame-ancestors
- HSTS when production HTTPS is ready

## Storage

- Public assets can use public bucket.
- Professional documents, booking attachments, dispute evidence and message attachments must be private.
- Use UUID internal paths and signed URLs.
