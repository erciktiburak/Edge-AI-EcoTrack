import "./load-env";
import { eq } from "drizzle-orm";

import { assertDatabaseConnection, db } from "../src/db/client";
import { carbonMetrics, energyReadings, users } from "../src/db/schema";
import { assertTursoEnv } from "../src/lib/env";

function toDayLabel(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function run() {
  assertTursoEnv();
  await assertDatabaseConnection();

  if (!db) {
    throw new Error("Database connection is unavailable.");
  }

  const clerkUserId = "seed_user_demo";

  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });

  const userId = existingUser?.id ?? crypto.randomUUID();

  if (!existingUser) {
    await db.insert(users).values({
      id: userId,
      clerkUserId,
      homeCountryCode: "US",
    });
  }

  await db.delete(energyReadings).where(eq(energyReadings.userId, userId));
  await db.delete(carbonMetrics).where(eq(carbonMetrics.userId, userId));

  const now = new Date();
  const readingRows: Array<typeof energyReadings.$inferInsert> = [];
  const metricRows: Array<typeof carbonMetrics.$inferInsert> = [];

  for (let index = 0; index < 7; index += 1) {
    const day = new Date(now);
    day.setDate(now.getDate() - (6 - index));

    const kwh = Number((13.5 + index * 0.6 + Math.sin(index * 0.75) * 2.1).toFixed(2));
    const gridIntensity = Number((0.4 + Math.cos(index * 0.5) * 0.03).toFixed(3));
    const carbonKg = Number((kwh * gridIntensity).toFixed(2));

    readingRows.push({
      userId,
      source: "seed-smart-meter",
      kwh,
      carbonKg,
      capturedAt: day.getTime(),
    });

    metricRows.push({
      userId,
      day: toDayLabel(day),
      totalKwh: kwh,
      totalCarbonKg: carbonKg,
      gridIntensity,
    });
  }

  await db.insert(energyReadings).values(readingRows);
  await db.insert(carbonMetrics).values(metricRows);

  console.log("Seed completed for user:", clerkUserId);
  console.log("Inserted rows:", { energyReadings: readingRows.length, carbonMetrics: metricRows.length });
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
