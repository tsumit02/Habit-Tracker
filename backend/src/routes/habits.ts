
import { Router, Response } from "express";
import { pool } from "../config/database.js";
import {
  AuthRequest,
  authenticateToken,
} from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

const VALID_FREQUENCIES = [
  "daily",
  "weekdays",
  "custom",
  "weekly",
] as const;

type Frequency = (typeof VALID_FREQUENCIES)[number];

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS = [1, 2, 3, 4, 5];

function isValidHabitId(value: unknown): value is string {
  return typeof value === "string" && /^[1-9]\d*$/.test(value);
}

function isValidFrequency(value: unknown): value is Frequency {
  return (
    typeof value === "string" &&
    VALID_FREQUENCIES.includes(value as Frequency)
  );
}

function isValidScheduledDays(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (day) =>
        Number.isInteger(day) &&
        day >= 0 &&
        day <= 6
    ) &&
    new Set(value).size === value.length
  );
}

function defaultScheduledDays(frequency: Frequency): number[] {
  if (frequency === "weekdays") return WEEKDAYS;
  if (frequency === "custom") return ALL_DAYS;
  if (frequency === "weekly") return ALL_DAYS;
  return ALL_DAYS;
}

const HABIT_COLUMNS = `
  id, title, description, subtitle, emoji, frequency,
  scheduled_days, is_active, created_at, updated_at
`;

// GET /api/habits
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT ${HABIT_COLUMNS}
       FROM habits
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.userId]
    );

    res.json({ habits: result.rows });
  } catch (error) {
    console.error("Failed to fetch habits:", error);
    res.status(500).json({ message: "Unable to fetch habits." });
  }
});

// POST /api/habits
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body ?? {};
    const {
      title,
      description = null,
      subtitle = "",
      emoji = "🎯",
      frequency = "daily",
    } = body;

    const scheduledDays =
      body.scheduled_days ??
      defaultScheduledDays(frequency as Frequency);

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 150
    ) {
      res.status(400).json({
        message: "Title is required and must be at most 150 characters.",
      });
      return;
    }

    if (
      description !== null &&
      typeof description !== "string"
    ) {
      res.status(400).json({
        message: "Description must be a string or null.",
      });
      return;
    }

    if (typeof subtitle !== "string" || subtitle.length > 255) {
      res.status(400).json({
        message: "Subtitle must be a string of at most 255 characters.",
      });
      return;
    }

    if (typeof emoji !== "string" || emoji.length > 20) {
      res.status(400).json({
        message: "Emoji must be a string of at most 20 characters.",
      });
      return;
    }

    if (!isValidFrequency(frequency)) {
      res.status(400).json({
        message: "Frequency must be daily, weekdays, custom, or weekly.",
      });
      return;
    }

    if (!isValidScheduledDays(scheduledDays)) {
      res.status(400).json({
        message: "scheduled_days must contain unique day numbers from 0 to 6.",
      });
      return;
    }

    if (
      typeof description === "string" &&
      description.length > 10000
    ) {
      res.status(400).json({ message: "Description is too long." });
      return;
    }

    const result = await pool.query(
      `INSERT INTO habits
        (user_id, title, description, subtitle, emoji, frequency, scheduled_days)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${HABIT_COLUMNS}`,
      [
        req.userId,
        title.trim(),
        description,
        subtitle.trim(),
        emoji,
        frequency,
        scheduledDays,
      ]
    );

    res.status(201).json({
      message: "Habit created successfully.",
      habit: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create habit:", error);
    res.status(500).json({ message: "Unable to create habit." });
  }
});

// PATCH /api/habits/:id
router.patch("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;

    if (!isValidHabitId(id)) {
      res.status(400).json({ message: "Invalid habit ID." });
      return;
    }

    const body = req.body ?? {};
    const updates: string[] = [];
    const values: unknown[] = [];

    function addUpdate(column: string, value: unknown) {
      values.push(value);
      updates.push(`${column} = $${values.length}`);
    }

    if (Object.hasOwn(body, "title")) {
      if (
        typeof body.title !== "string" ||
        !body.title.trim() ||
        body.title.trim().length > 150
      ) {
        res.status(400).json({ message: "Invalid habit title." });
        return;
      }
      addUpdate("title", body.title.trim());
    }

    if (Object.hasOwn(body, "description")) {
      if (
        body.description !== null &&
        typeof body.description !== "string"
      ) {
        res.status(400).json({
          message: "Description must be a string or null.",
        });
        return;
      }

      if (
        typeof body.description === "string" &&
        body.description.length > 10000
      ) {
        res.status(400).json({ message: "Description is too long." });
        return;
      }
      addUpdate("description", body.description);
    }

    if (Object.hasOwn(body, "subtitle")) {
      if (
        typeof body.subtitle !== "string" ||
        body.subtitle.length > 255
      ) {
        res.status(400).json({ message: "Invalid subtitle." });
        return;
      }
      addUpdate("subtitle", body.subtitle.trim());
    }

    if (Object.hasOwn(body, "emoji")) {
      if (
        typeof body.emoji !== "string" ||
        body.emoji.length > 20
      ) {
        res.status(400).json({ message: "Invalid emoji." });
        return;
      }
      addUpdate("emoji", body.emoji);
    }

    if (Object.hasOwn(body, "frequency")) {
      if (!isValidFrequency(body.frequency)) {
        res.status(400).json({ message: "Invalid frequency." });
        return;
      }
      addUpdate("frequency", body.frequency);
    }

    if (Object.hasOwn(body, "scheduled_days")) {
      if (!isValidScheduledDays(body.scheduled_days)) {
        res.status(400).json({
          message: "scheduled_days must contain unique day numbers from 0 to 6.",
        });
        return;
      }
      addUpdate("scheduled_days", body.scheduled_days);
    }

    if (Object.hasOwn(body, "is_active")) {
      if (typeof body.is_active !== "boolean") {
        res.status(400).json({
          message: "is_active must be a boolean.",
        });
        return;
      }
      addUpdate("is_active", body.is_active);
    }

    if (updates.length === 0) {
      res.status(400).json({
        message: "Provide at least one valid field to update.",
      });
      return;
    }

    values.push(id);
    const idPosition = values.length;

    values.push(req.userId);
    const userPosition = values.length;

    const result = await pool.query(
      `UPDATE habits
       SET ${updates.join(", ")}, updated_at = NOW()
       WHERE id = $${idPosition} AND user_id = $${userPosition}
       RETURNING ${HABIT_COLUMNS}`,
      values
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Habit not found." });
      return;
    }

    res.json({
      message: "Habit updated successfully.",
      habit: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to update habit:", error);
    res.status(500).json({ message: "Unable to update habit." });
  }
});

// DELETE /api/habits/:id
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;

    if (!isValidHabitId(id)) {
      res.status(400).json({ message: "Invalid habit ID." });
      return;
    }

    const result = await pool.query(
      `DELETE FROM habits
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.userId]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Habit not found." });
      return;
    }

    res.json({ message: "Habit deleted successfully." });
  } catch (error) {
    console.error("Failed to delete habit:", error);
    res.status(500).json({ message: "Unable to delete habit." });
  }
});

export default router;
