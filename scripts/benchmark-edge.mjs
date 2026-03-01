import { performance } from "node:perf_hooks";

const BASE_URL = process.env.BENCH_BASE_URL ?? "http://127.0.0.1:3000";
const RUNS = Number(process.env.BENCH_RUNS ?? 30);
const WARMUP = 5;

const webhookPayload = {
  eventId: `evt_bench_${Date.now()}`,
  clerkUserId: "demo-user",
  source: "smart-meter",
  kwh: 12.4,
  carbonKg: 5.2,
  capturedAt: new Date().toISOString(),
};

const endpoints = [
  {
    name: "dashboard",
    url: `${BASE_URL}/dashboard`,
    init: { method: "GET" },
  },
  {
    name: "summary",
    url: `${BASE_URL}/api/energy/summary`,
    init: { method: "GET" },
  },
  {
    name: "webhook",
    url: `${BASE_URL}/api/energy/webhook`,
    init: {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.ENERGY_WEBHOOK_SECRET
          ? { "x-energy-signature": process.env.ENERGY_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify(webhookPayload),
    },
  },
];

function percentile(sortedValues, p) {
  const idx = Math.ceil((p / 100) * sortedValues.length) - 1;
  return sortedValues[Math.max(0, Math.min(idx, sortedValues.length - 1))];
}

async function measureEndpoint(endpoint) {
  for (let i = 0; i < WARMUP; i += 1) {
    await fetch(endpoint.url, endpoint.init);
  }

  const timings = [];
  const statuses = new Map();

  for (let i = 0; i < RUNS; i += 1) {
    const start = performance.now();
    const response = await fetch(endpoint.url, endpoint.init);
    await response.arrayBuffer();
    const duration = performance.now() - start;
    timings.push(duration);
    statuses.set(response.status, (statuses.get(response.status) ?? 0) + 1);
  }

  timings.sort((a, b) => a - b);
  const average = timings.reduce((sum, value) => sum + value, 0) / timings.length;
  const statusSummary = Array.from(statuses.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([status, count]) => `${status}x${count}`)
    .join(", ");

  return {
    name: endpoint.name,
    average,
    p50: percentile(timings, 50),
    p95: percentile(timings, 95),
    statusSummary,
  };
}

async function run() {
  console.log(`Benchmarking ${endpoints.length} endpoints on ${BASE_URL}`);
  console.log(`Runs per endpoint: ${RUNS} (warmup: ${WARMUP})`);

  for (const endpoint of endpoints) {
    const result = await measureEndpoint(endpoint);
    console.log(
      `${result.name.padEnd(10)} avg=${result.average.toFixed(2)}ms p50=${result.p50.toFixed(2)}ms p95=${result.p95.toFixed(2)}ms statuses=[${result.statusSummary}]`,
    );
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
