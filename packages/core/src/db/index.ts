import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import dotenv from "dotenv";

dotenv.config({
  path: "../../../../.env",
});

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
const db = drizzle(sql);

export { db };
