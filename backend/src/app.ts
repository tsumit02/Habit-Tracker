
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pool } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habits.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Habit Tracker API is running",
  });
});

app.get("/api/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS database_time");

    res.status(200).json({
      status: "ok",
      database: "connected",
      databaseTime: result.rows[0].database_time,
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

export default app;
