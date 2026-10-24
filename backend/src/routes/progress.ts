
import { Router, Response } from "express";
import { pool } from "../config/database.js";
import {
  AuthRequest,
  authenticateToken,
} from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

type Habit = {
  id: string | number;
  title: string;
  frequency: "daily" | "weekly";
  is_active: boolean;
};

type Completion = {
  habit_id: string | number;
  completed_on: string;
};

function shiftDate(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function mondayOf(date: string): string {
  const day = new Date(`${date}T00:00:00.000Z`).getUTCDay();
  return shiftDate(date, -(day === 0 ? 6 : day - 1));
}

function calculateStreak(
  dates: string[],
  frequency: "daily" | "weekly",
  today: string
): number {
  const periods = new Set(
    dates.map((date) =>
      frequency === "daily" ? date : mondayOf(date)
    )
  );

  const currentPeriod =
    frequency === "daily" ? today : mondayOf(today);

  // A streak remains alive if the last completion was in
  // the immediately preceding day or week.
  let anchor = currentPeriod;

  if (!periods.has(anchor)) {
    anchor = shiftDate(
      anchor,
      frequency === "daily" ? -1 : -7
    );
  }

  if (!periods.has(anchor)) {
    return 0;
  }

  let streak = 0;

  while (periods.has(anchor)) {
    streak++;
    anchor = shiftDate(
      anchor,
      frequency === "daily" ? -1 : -7
    );
  }

  return streak;
}

// GET /api/progress
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const [dateResult, habitsResult, completionsResult] =
      await Promise.all([
        pool.query(
          `SELECT
             CURRENT_DATE::text AS today,
             date_trunc('week', CURRENT_DATE)::date::text AS week_start`
        ),
        pool.query(
          `SELECT id, title, frequency, is_active
           FROM habits
           WHERE user_id = $1
           ORDER BY created_at DESC`,
          [req.userId]
        ),
        pool.query(
          `SELECT hc.habit_id, hc.completed_on::text AS completed_on
           FROM habit_completions hc
           INNER JOIN habits h ON h.id = hc.habit_id
           WHERE h.user_id = $1
             AND hc.completed_on <= CURRENT_DATE
           ORDER BY hc.completed_on DESC`,
          [req.userId]
        ),
      ]);

    const { today, week_start: weekStart } = dateResult.rows[0];

    const habits = habitsResult.rows as Habit[];
    const completions = completionsResult.rows as Completion[];

    const activeHabits = habits.filter((habit) => habit.is_active);
    const dailyHabits = activeHabits.filter(
      (habit) => habit.frequency === "daily"
    );
    const weeklyHabits = activeHabits.filter(
      (habit) => habit.frequency === "weekly"
    );

    const datesByHabit = new Map<string, string[]>();

    for (const completion of completions) {
      const key = String(completion.habit_id);
      const dates = datesByHabit.get(key) ?? [];
      dates.push(completion.completed_on);
      datesByHabit.set(key, dates);
    }

    const completedTodayIds = new Set(
      completions
        .filter((item) => item.completed_on === today)
        .map((item) => String(item.habit_id))
    );

    const weekEnd = shiftDate(weekStart, 6);
    const weeklyCompletions = completions.filter(
      (item) =>
        item.completed_on >= weekStart &&
        item.completed_on <= weekEnd
    );

    const completedWeeklyIds = new Set(
      weeklyCompletions.map((item) => String(item.habit_id))
    );

    const completedDailyToday = dailyHabits.filter((habit) =>
      completedTodayIds.has(String(habit.id))
    ).length;

    const completedWeeklyHabits = weeklyHabits.filter((habit) =>
      completedWeeklyIds.has(String(habit.id))
    ).length;

    const completionRateToday =
      dailyHabits.length === 0
        ? 0
        : Math.round(
            (completedDailyToday / dailyHabits.length) * 100
          );

    const weeklyProgress = Array.from({ length: 7 }, (_, index) => {
      const date = shiftDate(weekStart, index);
      const completedIds = new Set(
        weeklyCompletions
          .filter((item) => item.completed_on === date)
          .map((item) => String(item.habit_id))
      );

      return {
        date,
        completedHabits: completedIds.size,
      };
    });

    const habitSummaries = habits.map((habit) => {
      const dates = datesByHabit.get(String(habit.id)) ?? [];

      return {
        id: habit.id,
        title: habit.title,
        frequency: habit.frequency,
        isActive: habit.is_active,
        completedToday: completedTodayIds.has(String(habit.id)),
        completedThisWeek: completedWeeklyIds.has(String(habit.id)),
        totalCompletions: dates.length,
        currentStreak: calculateStreak(
          dates,
          habit.frequency,
          today
        ),
      };
    });

    res.json({
      period: {
        today,
        weekStart,
        weekEnd,
      },
      today: {
        activeDailyHabits: dailyHabits.length,
        completedHabits: completedDailyToday,
        completionRate: completionRateToday,
      },
      week: {
        activeWeeklyHabits: weeklyHabits.length,
        completedHabits: completedWeeklyHabits,
        completionRate:
          weeklyHabits.length === 0
            ? 0
            : Math.round(
                (completedWeeklyHabits / weeklyHabits.length) * 100
              ),
        dailyCompletions: weeklyProgress,
      },
      habits: habitSummaries,
    });
  } catch (error) {
    console.error("Failed to calculate progress:", error);
    res.status(500).json({ message: "Unable to calculate progress." });
  }
});

export default router;
