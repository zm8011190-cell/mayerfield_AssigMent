import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema.js";
import * as authSchema from "../db/auth-schema.js";

// Relative imports (not "@/") so plain Node can run db/seed.mjs too.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema: { ...schema, ...authSchema } });
