
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "../services/api";

export type HabitFrequency = "daily" | "weekdays" | "custom";

export type Habit = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  completed: boolean;
  completedDates: string[];
  frequency: HabitFrequency;
  scheduledDays: number[];
};

type HabitContextType = {
  habits: Habit[];
  isLoading: boolean;
  refreshHabits: () => Promise<void>;
  addHabit: (
    title: string,
    subtitle: string,
    emoji: string,
    frequency: HabitFrequency,
    scheduledDays: number[]
  ) => Promise<void>;
  updateHabit: (
    id: string,
    title: string,
    subtitle: string,
    emoji: string,
    frequency: HabitFrequency,
    scheduledDays: number[]
  ) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
};

const STORAGE_KEY = "@habit_tracker/habits";

const WEEKDAYS = [1, 2, 3, 4, 5];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

function getDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function normalizeCompletionDate(value: string): string {
  // PostgreSQL DATE values may arrive as UTC midnight timestamps.
  // Convert timestamps to the device's local calendar date.
  if (value.includes("T")) {
    return getDateKey(new Date(value));
  }

  return value.slice(0, 10);
}

type ApiHabit = {
  id: string | number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  emoji?: string | null;
  frequency?: string | null;
  scheduled_days?: number[] | null;
};

type ApiCompletion = {
  completed_on: string;
};

function mapHabit(
  item: ApiHabit,
  completedDates: string[]
): Habit {
  const frequency: HabitFrequency =
    item.frequency === "weekdays" || item.frequency === "custom"
      ? item.frequency
      : "daily";

  const scheduledDays = Array.isArray(item.scheduled_days)
    ? item.scheduled_days
    : frequency === "weekdays"
      ? WEEKDAYS
      : ALL_DAYS;

  const dates = [...new Set(completedDates)];

  return {
    id: String(item.id),
    title: item.title,
    subtitle: item.subtitle || item.description || "Daily goal",
    emoji: item.emoji || "🎯",
    completedDates: dates,
    completed: dates.includes(getDateKey()),
    frequency,
    scheduledDays,
  };
}

const HabitContext = createContext<HabitContextType | undefined>(
  undefined
);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshHabits = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await apiRequest<{ habits: ApiHabit[] }>(
        "/api/habits"
      );

      const loadedHabits = await Promise.all(
        response.habits.map(async (item) => {
          try {
            const completionResponse = await apiRequest<{
              completions: ApiCompletion[];
            }>(`/api/habits/${item.id}/completions`);

      const dates = completionResponse.completions
        .map((completion) =>
          normalizeCompletionDate(completion.completed_on)
        )
        .filter(Boolean);

            return mapHabit(item, dates);
          } catch (error) {
            console.error(
              `[Habits] Could not load completions for habit ${item.id}:`,
              error
            );

            return mapHabit(item, []);
          }
        })
      );

      setHabits(loadedHabits);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(loadedHabits)
      );

      console.log(`[Habits] Loaded ${loadedHabits.length} habits from API`);
    } catch (error) {
      console.error("[Habits] Failed to fetch habits:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function initialLoad() {
      try {
        const response = await apiRequest<{ habits: ApiHabit[] }>(
          "/api/habits"
        );

        const loadedHabits = await Promise.all(
          response.habits.map(async (item) => {
            try {
              const result = await apiRequest<{
                completions: ApiCompletion[];
              }>(`/api/habits/${item.id}/completions`);

        const dates = result.completions
          .map((completion) =>
            normalizeCompletionDate(completion.completed_on)
          )
          .filter(Boolean);

              return mapHabit(item, dates);
            } catch (error) {
              console.error(
                `[Habits] Completion fetch failed for ${item.id}:`,
                error
              );
              return mapHabit(item, []);
            }
          })
        );

        if (active) {
          setHabits(loadedHabits);
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(loadedHabits)
          );
        }
      } catch (error) {
        console.error("[Habits] Initial API load failed:", error);

        // Keep any existing local data visible if the API is unavailable.
        try {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);

          if (active && saved) {
            const parsed: unknown = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setHabits(parsed as Habit[]);
            }
          }
        } catch (storageError) {
          console.error("[Habits] Local fallback failed:", storageError);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void initialLoad();

    return () => {
      active = false;
    };
  }, []);

  const addHabit = async (
    title: string,
    subtitle: string,
    emoji: string,
    frequency: HabitFrequency,
    scheduledDays: number[]
  ): Promise<void> => {
    const response = await apiRequest<{ habit: ApiHabit }>(
      "/api/habits",
      {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim() || "Daily goal",
          description: subtitle.trim() || null,
          emoji,
          frequency,
          scheduled_days: [...new Set(scheduledDays)].sort(),
        }),
      }
    );

    setHabits((current) => [
      mapHabit(response.habit, []),
      ...current,
    ]);
  };

  const updateHabit = async (
    id: string,
    title: string,
    subtitle: string,
    emoji: string,
    frequency: HabitFrequency,
    scheduledDays: number[]
  ): Promise<void> => {
    const response = await apiRequest<{ habit: ApiHabit }>(
      `/api/habits/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim() || "Daily goal",
          description: subtitle.trim() || null,
          emoji,
          frequency,
          scheduled_days: [...new Set(scheduledDays)].sort(),
        }),
      }
    );

    setHabits((current) =>
      current.map((habit) =>
        habit.id === id
          ? mapHabit(
              response.habit,
              habit.completedDates
            )
          : habit
      )
    );
  };

  const deleteHabit = async (id: string): Promise<void> => {
    await apiRequest<void>(`/api/habits/${id}`, {
      method: "DELETE",
    });

    setHabits((current) =>
      current.filter((habit) => habit.id !== id)
    );
  };

  const toggleHabit = async (id: string): Promise<void> => {
    const today = getDateKey();
    const habit = habits.find((item) => item.id === id);

    if (!habit) return;

    const alreadyCompleted = habit.completedDates.includes(today);

    if (alreadyCompleted) {
      await apiRequest<void>(
        `/api/habits/${id}/completions/${today}`,
        { method: "DELETE" }
      );
    } else {
      await apiRequest(
        `/api/habits/${id}/completions`,
        {
          method: "POST",
          body: JSON.stringify({ completed_on: today }),
        }
      );
    }

    setHabits((current) =>
      current.map((item) => {
        if (item.id !== id) return item;

        const completedDates = alreadyCompleted
          ? item.completedDates.filter((date) => date !== today)
          : [...item.completedDates, today];

        return {
          ...item,
          completedDates,
          completed: !alreadyCompleted,
        };
      })
    );
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        isLoading,
        refreshHabits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);

  if (!context) {
    throw new Error("useHabits must be used inside HabitProvider");
  }

  return context;
}
