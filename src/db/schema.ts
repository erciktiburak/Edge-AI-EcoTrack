import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  homeCountryCode: text("home_country_code").notNull().default("US"),
  createdAt: integer("created_at", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const energyReadings = sqliteTable(
  "energy_readings",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    source: text("source").notNull(),
    kwh: real("kwh").notNull(),
    carbonKg: real("carbon_kg").notNull(),
    capturedAt: integer("captured_at", { mode: "number" }).notNull(),
    createdAt: integer("created_at", { mode: "number" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => ({
    userIdx: index("energy_user_idx").on(table.userId),
    capturedIdx: index("energy_captured_idx").on(table.capturedAt),
  }),
);

export const carbonAnalyses = sqliteTable(
  "carbon_analyses",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    prompt: text("prompt").notNull(),
    recommendation: text("recommendation").notNull(),
    savingsPotentialKg: real("savings_potential_kg").notNull(),
    createdAt: integer("created_at", { mode: "number" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => ({
    userIdx: index("analysis_user_idx").on(table.userId),
  }),
);

export const webhookEvents = sqliteTable(
  "webhook_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    providerEventId: text("provider_event_id").notNull().unique(),
    payload: text("payload", { mode: "json" }).$type<Record<string, unknown>>(),
    receivedAt: integer("received_at", { mode: "number" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => ({
    eventIdx: index("webhook_event_idx").on(table.providerEventId),
  }),
);

export const carbonMetrics = sqliteTable(
  "carbon_metrics",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    day: text("day").notNull(),
    totalKwh: real("total_kwh").notNull(),
    totalCarbonKg: real("total_carbon_kg").notNull(),
    gridIntensity: real("grid_intensity").notNull(),
    createdAt: integer("created_at", { mode: "number" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => ({
    userIdx: index("metrics_user_idx").on(table.userId),
    dayIdx: index("metrics_day_idx").on(table.day),
    userDayUnique: uniqueIndex("metrics_user_day_unique").on(table.userId, table.day),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  energyReadings: many(energyReadings),
  carbonAnalyses: many(carbonAnalyses),
  carbonMetrics: many(carbonMetrics),
}));

export const energyReadingsRelations = relations(energyReadings, ({ one }) => ({
  user: one(users, {
    fields: [energyReadings.userId],
    references: [users.id],
  }),
}));

export const carbonAnalysesRelations = relations(carbonAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [carbonAnalyses.userId],
    references: [users.id],
  }),
}));

export const carbonMetricsRelations = relations(carbonMetrics, ({ one }) => ({
  user: one(users, {
    fields: [carbonMetrics.userId],
    references: [users.id],
  }),
}));

export type EnergyReading = typeof energyReadings.$inferSelect;
export type CarbonAnalysis = typeof carbonAnalyses.$inferSelect;
export type CarbonMetric = typeof carbonMetrics.$inferSelect;
