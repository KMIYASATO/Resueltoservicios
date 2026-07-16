# Runbook

## Local Setup

1. Install Node.js LTS.
2. Enable pnpm with Corepack or install pnpm.
3. Copy `.env.example` to `.env.local` in `apps/web` when credentials exist.
4. Run `pnpm install`.
5. Run `pnpm dev`.

## Common Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

## Deployment Checklist

- No secrets in repository.
- Build passes.
- RLS policies reviewed.
- Environment variables configured per environment.
- Payment provider still simulated unless approved.
- Security headers configured.
