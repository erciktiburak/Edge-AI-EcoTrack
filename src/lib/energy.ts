import { and, eq, gte, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { energyReadings } from "@/db/schema";

export type DailyEnergyPoint = {
  day: string;
  kwh: number;
  carbonKg: number;
};

export type EnergySummary = {
  totalKwh: number;
  totalCarbonKg: number;
  trend: DailyEnergyPoint[];
};

function toDayLabel(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildMockSummary(): EnergySummary {
  const today = new Date();
  const trend: DailyEnergyPoint[] = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - index));

    const kwh = 14 + Math.sin(index) * 2 + index * 0.4;
    const carbonKg = kwh * 0.42;

    return {
      day: toDayLabel(day),
      kwh: Number(kwh.toFixed(2)),
      carbonKg: Number(carbonKg.toFixed(2)),
    };
  });

  return {
    totalKwh: Number(trend.reduce((acc, point) => acc + point.kwh, 0).toFixed(2)),
    totalCarbonKg: Number(
      trend.reduce((acc, point) => acc + point.carbonKg, 0).toFixed(2),
    ),
    trend,
  };
}

export async function getEnergySummaryByUser(userId: string): Promise<EnergySummary> {
  if (!db) {
    return buildMockSummary();
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dayBucket = sql<string>`date(${energyReadings.capturedAt} / 1000, 'unixepoch')`;

  const rows = await db
    .select({
      day: dayBucket,
      kwh: sql<number>`sum(${energyReadings.kwh})`,
      carbonKg: sql<number>`sum(${energyReadings.carbonKg})`,
    })
    .from(energyReadings)
    .where(and(eq(energyReadings.userId, userId), gte(energyReadings.capturedAt, sevenDaysAgo.getTime())))
    .groupBy(dayBucket)
    .orderBy(dayBucket);

  if (rows.length === 0) {
    return buildMockSummary();
  }

  const trend = rows.map((row) => ({
    day: row.day,
    kwh: Number(Number(row.kwh).toFixed(2)),
    carbonKg: Number(Number(row.carbonKg).toFixed(2)),
  }));

  return {
    totalKwh: Number(trend.reduce((acc, point) => acc + point.kwh, 0).toFixed(2)),
    totalCarbonKg: Number(
      trend.reduce((acc, point) => acc + point.carbonKg, 0).toFixed(2),
    ),
    trend,
  };
}
