import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env, hasTurso } from "@/lib/env";
import * as schema from "@/db/schema";

const tursoClient = hasTurso
  ? createClient({
      url: env.server.TURSO_DATABASE_URL!,
      authToken: env.server.TURSO_AUTH_TOKEN,
    })
  : null;

export const db = tursoClient ? drizzle(tursoClient, { schema }) : null;
