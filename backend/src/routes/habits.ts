
import { Router, Response } from "express";
import { pool } from "../config/database.js";
import {
  AuthRequest,
  authenticateToken,
} from "../middleware/auth.js";

const router = Router();

// All habit endpoints require a valid JWT.
router.use(authenticateToken);

// GET /api/habits — list the current user's habits
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, title, description, frequency, is_active,
              created_at, updated_at
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

// POST /api/habits — create a habit
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { title, description = null, frequency = "daily" } =
      req.body ?? {};

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

    if (description && description.length > 10000) {
      res.status(400).json({
        message: "Description is too long.",
      });
      return;
    }

    if (!["daily", "weekly"].includes(frequency)) {
      res.status(400).json({
        message: "Frequency must be daily or weekly.",
      });
      return;
    }

    const result = await pool.query(
      `INSERT INTO habits (user_id, title, description, frequency)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, frequency, is_active,
                 created_at, updated_at`,
      [req.userId, title.trim(), description, frequency]
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

// PATCH /api/habits/:id — update only the current user's habit
router.patch("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
    res.status(400).json({ message: "Invalid habit ID." });
    return;
    }
    const body = req.body ?? {};

    if (!/^[1-9]\d*$/.test(id)) {
      res.status(400).json({ message: "Invalid habit ID." });
      return;
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (Object.hasOwn(body, "title")) {
      if (
        typeof body.title !== "string" ||
        !body.title.trim() ||
        body.title.trim().length > 150
      ) {
        res.status(400).json({ message: "Invalid habit title." });
        return;
      }

      values.push(body.title.trim());
      updates.push(`title = $${values.length}`);
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

      values.push(body.description);
      updates.push(`description = $${values.length}`);
    }

    if (Object.hasOwn(body, "frequency")) {
      if (!["daily", "weekly"].includes(body.frequency)) {
        res.status(400).json({
          message: "Frequency must be daily or weekly.",
        });
        return;
      }

      values.push(body.frequency);
      updates.push(`frequency = $${values.length}`);
    }

    if (Object.hasOwn(body, "is_active")) {
      if (typeof body.is_active !== "boolean") {
        res.status(400).json({
          message: "is_active must be a boolean.",
        });
        return;
      }

      values.push(body.is_active);
      updates.push(`is_active = $${values.length}`);
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
       RETURNING id, title, description, frequency, is_active,
                 created_at, updated_at`,
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

// DELETE /api/habits/:id — delete only the current user's habit
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;

    if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
    res.status(400).json({ message: "Invalid habit ID." });
    return;
    }

    if (!/^[1-9]\d*$/.test(id)) {
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
