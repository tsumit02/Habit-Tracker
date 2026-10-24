
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from the .env file");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

export async function testDatabaseConnection(): Promise<void> {
  const result = await pool.query(
    "SELECT current_database() AS database, current_user AS user"
  );

  console.log("PostgreSQL connected:", result.rows[0]);
}
