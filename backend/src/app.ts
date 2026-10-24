
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pool } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habits.js";
import completionRoutes from "./routes/completions.js";
import progressRoutes from "./routes/progress.js";

const app = express();


app.use((req, res, next) => {
  const startedAt = Date.now();

  console.log(`[HTTP] --> ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    console.log(
      `[HTTP] <-- ${req.method} ${req.originalUrl} ${res.statusCode} (${Date.now() - startedAt}ms)`
    );
  });

  next();
});


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/habits", completionRoutes);
app.use("/api/progress", progressRoutes);

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
