import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  addHabit: (
    title: string,
    subtitle: string,
    emoji: string,
    frequency: HabitFrequency,
    scheduledDays: number[]
  ) => void;
  updateHabit: (
    id: string,
    title: string,
    subtitle: string,
    emoji: string,
    frequency: HabitFrequency,
    scheduledDays: number[]
  ) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string) => void;
};

const STORAGE_KEY = "@habit_tracker/habits";

const WEEKDAYS = [1, 2, 3, 4, 5];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

// Use local calendar dates, not UTC dates.
function getDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const HabitContext = createContext<HabitContextType | undefined>(
  undefined
);

export function HabitProvider({ children }: { children: ReactNode }) {
  // New installations start with an empty habit list.
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  

  // Load existing habits and migrate older saved records.
  useEffect(() => {
    let active = true;

    async function loadHabits() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
          const parsed: unknown = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            const migrated: Habit[] = parsed
              .filter(
                (item) =>
                  item !== null &&
                  typeof item === "object" &&
                  typeof item.id === "string" &&
                  typeof item.title === "string" &&
                  typeof item.subtitle === "string" &&
                  typeof item.emoji === "string" &&
                  typeof item.completed === "boolean"
              )
              .map((item) => {
                const old = item as Partial<Habit>;

                const completedDates = Array.isArray(old.completedDates)
                  ? [
                      ...new Set(
                        old.completedDates.filter(
                          (date): date is string =>
                            typeof date === "string" &&
                            /^\d{4}-\d{2}-\d{2}$/.test(date)
                        )
                      ),
                    ]
                  : [];

                const frequency: HabitFrequency =
                  old.frequency === "weekdays" ||
                  old.frequency === "custom"
                    ? old.frequency
                    : "daily";

                const scheduledDays = Array.isArray(old.scheduledDays)
                  ? [
                      ...new Set(
                        old.scheduledDays.filter(
                          (day): day is number =>
                            Number.isInteger(day) &&
                            day >= 0 &&
                            day <= 6
                        )
                      ),
                    ]
                  : frequency === "weekdays"
                    ? WEEKDAYS
                    : ALL_DAYS;

                return {
                  id: old.id!,
                  title: old.title!,
                  subtitle: old.subtitle!,
                  emoji: old.emoji!,
                  completedDates,
                  completed: completedDates.includes(getDateKey()),
                  frequency,
                  scheduledDays,
                };
              });

            if (active) {
              setHabits(migrated);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load habits:", error);
      } finally {
        if (active) {
          setIsLoaded(true);
        }
      }
    }

    loadHabits();

    return () => {
      active = false;
    };
  }, []);

  // Save only after loading has finished.
  useEffect(() => {
    if (!isLoaded) return;

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(habits)
    ).catch((error) => {
      console.error("Failed to save habits:", error);
    });
  }, [habits, isLoaded]);

  const addHabit = (
    title: string,
    subtitle: string,
    emoji: string,
    frequency: HabitFrequency,
    scheduledDays: number[]
  ) => {
    const newHabit: Habit = {
      id: `${Date.now()}-${Math.random()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || "Daily goal",
      emoji,
      completed: false,
      completedDates: [],
      frequency,
      scheduledDays: [...new Set(scheduledDays)].sort(),
    };

    setHabits((current) => [...current, newHabit]);
  };
  const updateHabit = (
    id: string,
    title: string,
    subtitle: string,
    emoji: string,
    frequency: HabitFrequency,
    scheduledDays: number[]
  ) => {
    setHabits((current) =>
      current.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              title: title.trim(),
              subtitle: subtitle.trim() || "Daily goal",
              emoji,
              frequency,
              scheduledDays: [...new Set(scheduledDays)].sort(),
            }
          : habit
      )
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((current) =>
      current.filter((habit) => habit.id !== id)
    );
  };

  const toggleHabit = (id: string) => {
    const today = getDateKey();

    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== id) return habit;

        const alreadyCompleted = habit.completedDates.includes(today);

        const completedDates = alreadyCompleted
          ? habit.completedDates.filter((date) => date !== today)
          : [...habit.completedDates, today];

        return {
          ...habit,
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