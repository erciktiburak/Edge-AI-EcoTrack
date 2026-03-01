# GitHub Roadmap and Commit Plan

## Phase 1 - Foundation

1. `feat: init next16-tailwind4-bun-architecture`
   - Bootstrap Next.js 16 app router project.
   - Enable React Compiler.
   - Configure Tailwind CSS v4 and design tokens.
   - Set Bun as package manager target.

2. `feat: schema-design-with-drizzle-turso`
   - Add Drizzle + Turso configuration.
   - Define tables for users, energy readings, webhook events, and AI analyses.
   - Add migration and studio scripts.

## Phase 2 - Identity and Security

3. `feat: clerk-passkey-auth-integration`
   - Add Clerk provider, middleware protection, and auth routes.
   - Keep webhook route public while protecting dashboard APIs.

## Phase 3 - Intelligence Layer

4. `feat: ai-agent-carbon-analysis-engine`
   - Add LangChain prompt pipeline for carbon analysis planning.
   - Add Vercel AI SDK generation route with OpenAI model.
   - Persist analysis output for dashboard retrieval.

## Phase 4 - Live Data Flow

5. `feat: real-time-energy-api-webhooks`
   - Add edge webhook endpoint with signature and idempotency checks.
   - Store incoming events and normalized energy readings.
   - Add authenticated summary API for dashboard usage.

## Phase 5 - Product Experience

6. `feat: tremor4-dashboard-visualization`
   - Build sustainability dashboard with Tremor cards and trend chart.
   - Show AI recommendations and projected CO2 savings.

## Phase 6 - Performance

7. `perf: react-compiler-edge-optimization`
   - Confirm React Compiler setting.
   - Validate edge runtime paths and reduce server round trips.
   - Benchmark dashboard route and webhook processing latency.

## Notes

- Benchmark command: `npm run bench:edge`
- Baseline report: `docs/performance-benchmark.md`
