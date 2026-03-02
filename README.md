# Edge-AI Sustainability Platform

AI-native, edge-first platform for tracking household carbon footprint and optimizing personal energy usage.

## Stack

- Next.js 16 + React 19 + React Compiler
- Tailwind CSS v4
- Bun-first package manager strategy
- Turso (LibSQL) + Drizzle ORM
- Clerk passkey-first authentication
- Vercel AI SDK + LangChain.js
- Tremor dashboard visualizations

## Quick Start

1. Copy environment template:

```bash
cp .env.example .env.local
```

2. Fill required env vars in `.env.local`:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `OPENAI_API_KEY`
- `ENERGY_WEBHOOK_SECRET`

3. Install dependencies:

```bash
bun install
```

4. Run migrations:

```bash
bun run db:generate
bun run db:migrate
bun run db:seed
```

5. Start local dev server:

```bash
bun run dev
```

Open `http://localhost:3000`.

Shortcut for full DB bootstrap (generate + migrate + seed):

```bash
npm run db:init
```

## Core Routes

- `/` - Product landing page
- `/dashboard` - Authenticated carbon and energy dashboard
- `/api/energy/webhook` - Edge webhook ingestion endpoint
- `/api/energy/summary` - Authenticated energy summary endpoint
- `/api/ai/carbon-analysis` - AI recommendation generator

## Webhook Payload

`POST /api/energy/webhook`

Header:

- `x-energy-signature: <ENERGY_WEBHOOK_SECRET>`

Body:

```json
{
  "eventId": "evt_001",
  "clerkUserId": "user_2abc",
  "source": "smart-meter",
  "kwh": 17.8,
  "carbonKg": 7.44,
  "capturedAt": "2026-03-02T08:30:00.000Z"
}
```

## Roadmap

See `docs/github-roadmap.md` for commit-by-commit implementation milestones.

## Performance Validation

- Run local benchmark suite (while app is running): `npm run bench:edge`
- Latest benchmark notes: `docs/performance-benchmark.md`
