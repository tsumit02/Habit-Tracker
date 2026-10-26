
import { Router, Response } from "express";
import { pool } from "../config/database.js";
import {
  AuthRequest,
  authenticateToken,
} from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

function isValidDate(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function validHabitId(value: unknown): value is string {
  return typeof value === "string" && /^[1-9]\d*$/.test(value);
}

// POST /api/habits/:id/completions
router.post(
  "/:id/completions",
  async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id;
      const { completed_on } = req.body ?? {};

      if (!validHabitId(id)) {
        res.status(400).json({ message: "Invalid habit ID." });
        return;
      }

      if (!isValidDate(completed_on)) {
        res.status(400).json({
          message: "completed_on must be a valid date in YYYY-MM-DD format.",
        });
        return;
      }

      const habit = await pool.query(
        "SELECT id FROM habits WHERE id = $1 AND user_id = $2",
        [id, req.userId]
      );

      if (habit.rowCount === 0) {
        res.status(404).json({ message: "Habit not found." });
        return;
      }

    const result = await pool.query(
      `INSERT INTO habit_completions (habit_id, completed_on)
      VALUES ($1, $2)
      ON CONFLICT (habit_id, completed_on) DO NOTHING
      RETURNING id, habit_id, completed_on, created_at`,
      [id, completed_on]
    );

    if (result.rowCount === 0) {
      const existing = await pool.query(
        `SELECT id, habit_id, completed_on, created_at
        FROM habit_completions
        WHERE habit_id = $1 AND completed_on = $2`,
        [id, completed_on]
      );

      res.status(200).json({
        message: "Habit was already completed.",
        completion: existing.rows[0],
      });
      return;
    }

    res.status(201).json({
      message: "Habit marked as complete.",
      completion: result.rows[0],
    });
    } catch (error) {
      console.error("Failed to record completion:", error);
      res.status(500).json({
        message: "Unable to record habit completion.",
      });
    }
  }
);

// GET /api/habits/:id/completions
router.get(
  "/:id/completions",
  async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id;
      console.log("[Completions GET]", {
        habitId: id,
        userId: req.userId,
      });

      if (!validHabitId(id)) {
        res.status(400).json({ message: "Invalid habit ID." });
        return;
      }

      const result = await pool.query(
        `SELECT hc.id, hc.habit_id, hc.completed_on::text AS completed_on, hc.created_at
         FROM habit_completions hc
         INNER JOIN habits h ON h.id = hc.habit_id
         WHERE h.id = $1 AND h.user_id = $2
         ORDER BY hc.completed_on DESC`,
        [id, req.userId]
      );

      const habit = await pool.query(
        "SELECT id FROM habits WHERE id = $1 AND user_id = $2",
        [id, req.userId]
      );

      if (habit.rowCount === 0) {
        res.status(404).json({ message: "Habit not found." });
        return;
      }

      res.json({ completions: result.rows });
      console.log("[Completions GET] Result:", result.rows);
    } catch (error) {
      console.error("Failed to fetch completions:", error);
      res.status(500).json({
        message: "Unable to fetch completion history.",
      });
    }
  }
);

// DELETE /api/habits/:id/completions/:date
router.delete(
  "/:id/completions/:date",
  async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id;
      const date = req.params.date;

      if (!validHabitId(id)) {
        res.status(400).json({ message: "Invalid habit ID." });
        return;
      }

      if (!isValidDate(date)) {
        res.status(400).json({
          message: "Date must be valid and use YYYY-MM-DD format.",
        });
        return;
      }

      const result = await pool.query(
        `DELETE FROM habit_completions hc
         USING habits h
         WHERE hc.habit_id = h.id
           AND h.id = $1
           AND h.user_id = $2
           AND hc.completed_on = $3
         RETURNING hc.id`,
        [id, req.userId, date]
      );

      if (result.rowCount === 0) {
        res.status(404).json({
          message: "Habit completion not found.",
        });
        return;
      }

      res.json({ message: "Habit completion removed." });
    } catch (error) {
      console.error("Failed to remove completion:", error);
      res.status(500).json({
        message: "Unable to remove habit completion.",
      });
    }
  }
);

export default router;
