# Performance Benchmark (Phase 6)

Edge optimization checks completed for `perf: react-compiler-edge-optimization`.

## What was tuned

- React Compiler confirmed in `next.config.ts` (`reactCompiler: true`).
- Client dashboard removed manual `useMemo` usage to let React Compiler own memoization.
- Daily summary aggregation moved into SQL (`GROUP BY date(...)`) to reduce payload size and edge CPU.
- Dashboard now loads summary + latest AI analysis in parallel with `Promise.all`.
- Package import optimization enabled for charting-heavy bundles (`@tremor/react`, `recharts`).

## Local benchmark snapshot

Environment:

- Machine: local macOS dev machine
- Command: `npm run build && npm run start -- --hostname 127.0.0.1 --port 4012`
- Samples: 30 requests/route (after 5 warmup requests)

Results:

- `/dashboard`: avg `8.75ms`, p50 `8.52ms`, p95 `10.29ms`, status `200`
- `/api/energy/summary`: avg `1.59ms`, p50 `1.48ms`, p95 `1.77ms`, status `200`
- `/api/energy/webhook`: avg `1.91ms`, p50 `1.81ms`, p95 `2.09ms`, status `503`

Note: webhook benchmark above ran without Turso env vars set, so responses were `503 database_not_configured`. Use `npm run bench:edge` in a fully configured environment for production-representative webhook latency.

## Repeatable benchmark command

With the app running (`npm run start` or `npm run dev`):

```bash
npm run bench:edge
```

Optional envs:

- `BENCH_BASE_URL` (default `http://127.0.0.1:3000`)
- `BENCH_RUNS` (default `30`)
