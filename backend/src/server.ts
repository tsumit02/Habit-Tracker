
import dotenv from "dotenv";
import app from "./app.js";
import { pool, testDatabaseConnection } from "./config/database.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
  try {
    await testDatabaseConnection();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Habit Tracker API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the backend:", error);
    await pool.end();
    process.exit(1);
  }
}

void startServer();
