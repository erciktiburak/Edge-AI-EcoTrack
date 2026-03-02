import { z } from "zod";

const serverSchema = z.object({
  CLERK_SECRET_KEY: z.string().optional(),
  TURSO_DATABASE_URL: z.string().url().optional(),
  TURSO_AUTH_TOKEN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ENERGY_WEBHOOK_SECRET: z.string().optional(),
});

const publicSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
});

export const env = {
  server: serverSchema.parse(process.env),
  public: publicSchema.parse(process.env),
};

export const hasTurso =
  Boolean(env.server.TURSO_DATABASE_URL) && Boolean(env.server.TURSO_AUTH_TOKEN);

export function assertTursoEnv(): void {
  if (hasTurso) {
    return;
  }

  throw new Error(
    "Missing Turso configuration. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.",
  );
}
