import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { users } from "@/db/schema";
import { getEnergySummaryByUser } from "@/lib/energy";

export const runtime = "edge";

export async function GET() {
  const hasClerk =
    Boolean(process.env.CLERK_SECRET_KEY) &&
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const clerkUserId = hasClerk ? (await auth()).userId : "demo-user";

  if (!clerkUserId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!db) {
    const summary = await getEnergySummaryByUser(clerkUserId);
    return NextResponse.json(summary);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });

  if (!user) {
    return NextResponse.json({
      totalKwh: 0,
      totalCarbonKg: 0,
      trend: [],
    });
  }

  const summary = await getEnergySummaryByUser(user.id);

  return NextResponse.json(summary);
}
