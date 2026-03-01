import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { carbonAnalyses, users } from "@/db/schema";
import { analyzeCarbonProfile } from "@/lib/ai/carbon-agent";
import { getEnergySummaryByUser } from "@/lib/energy";

export const runtime = "edge";

export async function POST() {
  const hasClerk =
    Boolean(process.env.CLERK_SECRET_KEY) &&
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const clerkUserId = hasClerk ? (await auth()).userId : "demo-user";

  if (!clerkUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!db) {
    const summary = await getEnergySummaryByUser(clerkUserId);
    const analysis = await analyzeCarbonProfile(summary);
    return NextResponse.json(analysis);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });

  if (!user) {
    return NextResponse.json({ error: "user_not_found" }, { status: 404 });
  }

  const summary = await getEnergySummaryByUser(user.id);
  const analysis = await analyzeCarbonProfile(summary);

  await db.insert(carbonAnalyses).values({
    userId: user.id,
    prompt: JSON.stringify(summary),
    recommendation: analysis.recommendation,
    savingsPotentialKg: analysis.savingsPotentialKg,
  });

  return NextResponse.json(analysis);
}
