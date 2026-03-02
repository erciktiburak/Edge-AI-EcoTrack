import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";

import { env, hasTurso } from "@/lib/env";
import * as schema from "@/db/schema";

const tursoClient = hasTurso
  ? createClient({
      url: env.server.TURSO_DATABASE_URL!,
      authToken: env.server.TURSO_AUTH_TOKEN,
    })
  : null;

export const db = tursoClient ? drizzle(tursoClient, { schema }) : null;

export async function assertDatabaseConnection(): Promise<void> {
  if (!db) {
    throw new Error("Database is not configured. Check Turso environment variables.");
  }

  await db.run(sql`select 1`);
}
