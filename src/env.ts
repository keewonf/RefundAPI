import { z } from "zod";

// Validate required variables at startup to fail fast on invalid config.
const envSchema = z.object({
  DATABASE_URL: z.url({ error: "Invalid DATABASE_URL" }),
  JWT_SECRET: z.string({ error: "JWT_SECRET is required" }).min(1),
  PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
