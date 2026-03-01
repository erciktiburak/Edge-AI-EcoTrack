import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { EnergyDashboard } from "@/components/dashboard/energy-dashboard";
import { RunAnalysisButton } from "@/components/dashboard/run-analysis-button";
import { db } from "@/db/client";
import { carbonAnalyses, users } from "@/db/schema";
import { getEnergySummaryByUser } from "@/lib/energy";

export const runtime = "edge";

async function resolvePlatformUserId(clerkUserId: string): Promise<string | null> {
  if (!db) {
    return clerkUserId;
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });

  if (existing) {
    return existing.id;
  }

  const newUserId = crypto.randomUUID();

  await db.insert(users).values({
    id: newUserId,
    clerkUserId,
  });

  return newUserId;
}

export default async function DashboardPage() {
  const hasClerk =
    Boolean(process.env.CLERK_SECRET_KEY) &&
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  const clerkUserId = hasClerk ? (await auth()).userId : "demo-user";

  if (!clerkUserId && hasClerk) {
    redirect("/sign-in");
  }

  const resolvedClerkUserId = clerkUserId ?? "demo-user";

  const userId = await resolvePlatformUserId(resolvedClerkUserId);

  if (!userId) {
    redirect("/");
  }

  const [summary, latestAnalysis] = await Promise.all([
    getEnergySummaryByUser(userId),
    db
      ? db.query.carbonAnalyses.findFirst({
          where: eq(carbonAnalyses.userId, userId),
          orderBy: [desc(carbonAnalyses.createdAt)],
        })
      : Promise.resolve(null),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-16 md:px-8">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-teal-700">Edge-AI</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Sustainability Control Center
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-teal-950/90 md:text-base">
            Turso-powered telemetry, passkey-first auth, and an AI carbon analyst built
            for low-latency edge execution.
          </p>
        </div>
        <RunAnalysisButton />
      </header>

      <EnergyDashboard
        summary={summary}
        recommendation={latestAnalysis?.recommendation}
        savingsPotentialKg={latestAnalysis?.savingsPotentialKg}
      />
    </main>
  );
}
