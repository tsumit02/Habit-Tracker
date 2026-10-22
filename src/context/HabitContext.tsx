import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Habit = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  completed: boolean;
  completedDates: string[];
};

type HabitContextType = {
  habits: Habit[];
  addHabit: (title: string, subtitle: string, emoji: string) => void;
  toggleHabit: (id: string) => void;
};

const STORAGE_KEY = "@habit_tracker/habits";

function getDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const initialHabits: Habit[] = [];

const HabitContext = createContext<HabitContextType | undefined>(
  undefined
);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load and migrate saved habits.
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
                const habit = item as Partial<Habit>;
                const dates = Array.isArray(habit.completedDates)
                  ? habit.completedDates.filter(
                      (date): date is string =>
                        typeof date === "string" &&
                        /^\d{4}-\d{2}-\d{2}$/.test(date)
                    )
                  : habit.completed
                    ? [getDateKey()]
                    : [];

                return {
                  id: habit.id!,
                  title: habit.title!,
                  subtitle: habit.subtitle!,
                  emoji: habit.emoji!,
                  completed: dates.includes(getDateKey()),
                  completedDates: [...new Set(dates)],
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

  // Save after the initial load or migration is complete.
  useEffect(() => {
    if (!isLoaded) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits)).catch(
      (error) => console.error("Failed to save habits:", error)
    );
  }, [habits, isLoaded]);

  const addHabit = (
    title: string,
    subtitle: string,
    emoji: string
  ) => {
    const newHabit: Habit = {
      id: `${Date.now()}-${Math.random()}`,
      title,
      subtitle,
      emoji,
      completed: false,
      completedDates: [],
    };

    setHabits((current) => [...current, newHabit]);
  };

  const toggleHabit = (id: string) => {
    const today = getDateKey();

    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== id) return habit;

        const wasCompletedToday = habit.completedDates.includes(today);

        const completedDates = wasCompletedToday
          ? habit.completedDates.filter((date) => date !== today)
          : [...habit.completedDates, today];

        return {
          ...habit,
          completedDates,
          completed: !wasCompletedToday,
        };
      })
    );
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, toggleHabit }}>
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
