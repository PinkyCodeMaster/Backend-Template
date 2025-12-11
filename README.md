# Foundry API Starter

Production-ready Node.js API starter built with Hono, TypeScript, Drizzle ORM, Better Auth, Redis rate limiting, Prometheus metrics, Pino logging, Sentry tracing, and Resend-powered emails. This repo is meant to be a clean, extensible foundation for modern backend services.

## Highlights
- Hono + TypeScript with Zod-validated OpenAPI routes and auto-generated docs at `/docs`
- Environment validation with sensible defaults and LAN-aware base URL detection
- Pino logging (pretty in dev, JSON in prod) with request logging middleware
- Redis-backed rate limiting and cache utilities
- Drizzle ORM + Neon serverless Postgres driver with ready-to-run auth schema
- Better Auth (Expo + bearer + admin + 2FA + orgs) wired for email flows via Resend
- Prometheus metrics endpoint at `/api/v1/metrics`
- Sentry instrumentation (opt-in via `SENTRY_DSN`)
- CI pipeline for lint + build on push/PR

## Getting Started
1) **Install dependencies**
```bash
bun install
```

2) **Copy env template and fill in secrets**
```bash
cp .env.example .env
```
Required: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `REDIS_URL`, `FRONTEND_URL`, `BETTER_AUTH_URL`.

3) **Run services** (local examples)
```bash
# Redis
docker run -d --name redis -p 6379:6379 redis:7
```

4) **Start the API**
```bash
bun run dev
```
The server will pick a LAN IP for `BASE_URL` in dev; visit `/api/v1/health` and `/docs`.

## Scripts
- `bun run dev` - watch mode via `tsx`
- `bun run lint` - type-check only (`tsc --noEmit`)
- `bun run build` - compile TypeScript and rewrite paths with `tsc-alias`
- `bun start` - run compiled output (`dist`)
- `bun run db:generate` - drizzle-kit generate
- `bun run db:push` - drizzle-kit push
- `bun run openapi:emit` - generate `docs/openapi.json` from the app
- `bun run openapi:client` - generate typed client at `clients/openapi.ts`
- `bun run contracts:build` - emit OpenAPI + client
- `bun run contracts:test` - sanity-check the emitted OpenAPI JSON
- `bun run test:auth-contract` - minimal auth/OpenAPI contract check
- `bun run test:smoke` - in-process smoke checks for health/docs
- `k6 run k6/smoke.js` - lightweight load/smoke from the outside (set `BASE_URL`)

## Environment
See `.env.example` for defaults. Key variables:
- `APP_NAME`, `APP_VERSION`, `APP_SCHEME`, `APP_WEB_URL`
- `BASE_URL`, `PORT`, `LOG_LEVEL`
- `DATABASE_URL`, `FRONTEND_URL`
- `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`
- `RESEND_API_KEY`, `EMAIL_FROM`
- `SENTRY_DSN`, `SENTRY_ENV`, `SENTRY_RELEASE`
- `REDIS_URL`
- `CORS_EXTRA_ORIGINS`
- `RATE_LIMIT_GLOBAL_MAX`, `RATE_LIMIT_AUTH_MAX`
- `STORAGE_ENDPOINT`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY`, `STORAGE_BUCKET`, `STORAGE_USE_SSL`
- `INNGEST_EVENT_KEY`

## API Surface
- `/api/v1/health` - health check
- `/api/v1/metrics` - Prometheus metrics
- `/api/v1/auth/*` - Better Auth handler (REST + OpenAPI)
- `/docs` - OpenAPI JSON + docs UI

## Architecture Notes
- **App lifecycle**: graceful signal handling + unhandled error capture to Sentry (prod)
- **Middleware**: Sentry context, Prometheus registry, Pino request logger (with IP/UA + request IDs), Redis rate limiter (global + stricter auth limiter), CORS + security headers, global error handler, 404 handler
- **Auth**: Better Auth with Drizzle adapter (Postgres), Expo support, bearer signing, admin, orgs, 2FA, email verification/reset flows via Resend
- **Email**: React email templates (invite, OTP, verify, reset, welcome) branded via `APP_NAME`
- **Storage**: MinIO/S3 helper for presigned URLs and uploads
- **Async**: Inngest client stub for event-based jobs (set `INNGEST_EVENT_KEY` to enable sending)
- **Contracts**: OpenAPI doc emit + typed client generation via `openapi-typescript`

## Observability
- **Sentry**: set `SENTRY_DSN` (plus `SENTRY_ENV` and `SENTRY_RELEASE`) to capture errors; unhandled errors and 500s flush on shutdown.
- **Metrics**: `/api/v1/metrics` Prometheus endpoint; sample scrape config in `docs/observability/prometheus.yml`.
- **Logs**: Pino JSON in production (stdout). Ship to Loki/ELK/Datadog via an agent; sample Promtail file shipping `/var/log/foundry-api.log` in `docs/observability/promtail-config.yaml`.
- **Dashboards**: Import `docs/observability/grafana-dashboard.json` and point datasource UID `PROM_DS` at your Prometheus instance.
- **Crash test**: `/api/v1/crash` throws to validate alerting and error reporting.

## Local Dev Services
- `docker-compose.yml` spins up Postgres, Redis, and MinIO (S3-compatible).
- Defaults assume `STORAGE_ENDPOINT=http://localhost:9002`, Postgres on 5432, Redis on 6379.
- Make sure the API port (9000) does not conflict with MinIO (mapped to 9002).

## Developer Experience
- `Makefile` shortcuts: `make dev`, `make lint`, `make format`, `make build`, `make compose-up/down`.
- Pre-commit config (`.pre-commit-config.yaml`) ready for formatting/lint hooks if you use the `pre-commit` tool.

## CI/CD
GitHub Actions workflow runs on push/PR:
- Install dependencies with Bun
- `bun run lint` (type-check)
- `bun run build`
Extend with deploy, migrations, and smoke tests as you wire up your platform.

## Production Checklist
- Provide real secrets for database, Redis, Resend, Better Auth, and Sentry
- Set `BASE_URL`, `FRONTEND_URL`, and `BETTER_AUTH_URL` to public hosts
- Run behind TLS and put a reverse proxy (Caddy/Nginx) in front
- Configure process manager (systemd/PM2) and health checks on `/api/v1/health`
- Enable log shipping (Pino JSON) and metrics scraping on `/api/v1/metrics`
- Generate and ship OpenAPI (`bun run contracts:build`) and distribute `clients/openapi.ts` to consumers
- Validate crash reporting with `/api/v1/crash`; verify Prometheus scrape and log shipping
- Tighten CORS origins per environment and rotate credentials regularly
- Run external smoke/load: `k6 run k6/smoke.js -e BASE_URL=https://api.yourdomain.com -e VUS=10 -e DURATION=2m`

## Reverse Proxy
- See `deploy/nginx.conf` for an example Nginx config (HTTP→HTTPS redirect, gzip, proxy headers). Replace certificate paths and back-end host/port as needed.

## Next Steps (for future build-out)
- Add infra for file storage (e.g., MinIO/S3), background jobs (Inngest), and queueing
- Expand database schemas for domain models (finance/debts/baby steps stubs are placeholders)
- Harden auth flows (rate limiting per route, IP/device fingerprinting, email domain rules)
- Add security headers like CSP and stricter CORS policies per environment
- Add end-to-end smoke tests and load tests
