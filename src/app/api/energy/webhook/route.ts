import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db/client";
import { energyReadings, users, webhookEvents } from "@/db/schema";
import { env } from "@/lib/env";

export const runtime = "edge";

const webhookPayloadSchema = z.object({
  eventId: z.string().min(4),
  clerkUserId: z.string().min(3),
  source: z.string().default("smart-meter"),
  kwh: z.number().positive(),
  carbonKg: z.number().positive(),
  capturedAt: z.string().datetime().optional(),
});

async function resolvePlatformUserId(clerkUserId: string): Promise<string> {
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

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json(
      { error: "database_not_configured" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("x-energy-signature");

  if (
    env.server.ENERGY_WEBHOOK_SECRET &&
    signature !== env.server.ENERGY_WEBHOOK_SECRET
  ) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const payloadResult = webhookPayloadSchema.safeParse(await request.json());

  if (!payloadResult.success) {
    return NextResponse.json(
      { error: "invalid_payload", details: payloadResult.error.flatten() },
      { status: 400 },
    );
  }

  const payload = payloadResult.data;

  const existingEvent = await db.query.webhookEvents.findFirst({
    where: eq(webhookEvents.providerEventId, payload.eventId),
  });

  if (existingEvent) {
    return NextResponse.json({ ok: true, deduplicated: true }, { status: 202 });
  }

  const userId = await resolvePlatformUserId(payload.clerkUserId);

  await db.transaction(async (trx) => {
    await trx.insert(webhookEvents).values({
      providerEventId: payload.eventId,
      payload,
    });

    await trx.insert(energyReadings).values({
      userId,
      source: payload.source,
      kwh: payload.kwh,
      carbonKg: payload.carbonKg,
      capturedAt: payload.capturedAt
        ? new Date(payload.capturedAt).getTime()
        : Date.now(),
    });
  });

  return NextResponse.json({ ok: true });
}
