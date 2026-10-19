import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useHabits } from "../../context/HabitContext";

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getLastSevenDays() {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return {
      key: getDateKey(date),
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      date: date.getDate(),
    };
  });
}

export default function ProgressScreen() {
  const { habits } = useHabits();
  const days = getLastSevenDays();

  const todayKey = getDateKey(new Date());

  const completedToday = habits.filter((habit) =>
    habit.completedDates.includes(todayKey)
  ).length;

  const totalHabits = habits.length;

  const completionRate =
    totalHabits === 0
      ? 0
      : Math.round((completedToday / totalHabits) * 100);

  const weeklyCompletions = habits.reduce(
    (total, habit) =>
      total +
      days.filter((day) =>
        habit.completedDates.includes(day.key)
      ).length,
    0
  );

  const dailyCounts = days.map((day) => ({
    ...day,
    count: habits.filter((habit) =>
      habit.completedDates.includes(day.key)
    ).length,
  }));

  const maxCount = Math.max(totalHabits, 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Your Progress 📈</Text>
        <Text style={styles.subtitle}>
          Every small step counts.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            TODAY'S COMPLETION
          </Text>
          <Text style={styles.percentage}>
            {completionRate}%
          </Text>
          <Text style={styles.summaryDescription}>
            {completedToday} of {totalHabits} habits completed
          </Text>

          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${completionRate}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statValue}>
              {weeklyCompletions}
            </Text>
            <Text style={styles.statLabel}>
              Completions this week
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={styles.statValue}>
              {totalHabits}
            </Text>
            <Text style={styles.statLabel}>
              Total habits
            </Text>
          </View>
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.sectionTitle}>
            Last 7 days
          </Text>
          <Text style={styles.sectionSubtitle}>
            Completed habits per day
          </Text>

          {dailyCounts.map((day) => {
            const barWidth = (day.count / maxCount) * 100;

            return (
              <View key={day.key} style={styles.dayRow}>
                <View style={styles.dayLabel}>
                  <Text style={styles.dayName}>
                    {day.label}
                  </Text>
                  <Text style={styles.dayDate}>
                    {day.date}
                  </Text>
                </View>

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${barWidth}%` },
                    ]}
                  />
                </View>

                <Text style={styles.dayCount}>
                  {day.count}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.sectionTitle}>
            Habit history
          </Text>

          {habits.length === 0 ? (
            <Text style={styles.emptyText}>
              Add a habit to start tracking your progress.
            </Text>
          ) : (
            habits.map((habit) => {
              const currentStreak = (() => {
                let streak = 0;
                const date = new Date();

                if (!habit.completedDates.includes(todayKey)) {
                  date.setDate(date.getDate() - 1);
                }

                while (
                  habit.completedDates.includes(getDateKey(date))
                ) {
                  streak += 1;
                  date.setDate(date.getDate() - 1);
                }

                return streak;
              })();

              return (
                <View key={habit.id} style={styles.habitRow}>
                  <Text style={styles.habitEmoji}>
                    {habit.emoji}
                  </Text>

                  <View style={styles.habitInfo}>
                    <Text style={styles.habitTitle}>
                      {habit.title}
                    </Text>
                    <Text style={styles.habitSubtitle}>
                      {habit.completedDates.length} recorded days
                    </Text>
                  </View>

                  <Text style={styles.streak}>
                    🔥 {currentStreak}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },
  container: {
    padding: 20,
    paddingBottom: 35,
  },
  heading: {
    fontSize: 27,
    fontWeight: "700",
    color: "#20243A",
    marginTop: 12,
  },
  subtitle: {
    color: "#85899B",
    fontSize: 14,
    marginTop: 7,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: "#5965C9",
    padding: 22,
    borderRadius: 22,
    marginBottom: 18,
  },
  summaryLabel: {
    color: "#E0E3FF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  percentage: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "700",
    marginTop: 12,
  },
  summaryDescription: {
    color: "#E0E3FF",
    fontSize: 13,
    marginTop: 5,
    marginBottom: 20,
  },
  track: {
    height: 9,
    backgroundColor: "#858DE0",
    borderRadius: 10,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 17,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEF0F6",
  },
  statEmoji: {
    fontSize: 22,
  },
  statValue: {
    fontSize: 25,
    fontWeight: "700",
    color: "#292D40",
    marginTop: 12,
  },
  statLabel: {
    fontSize: 12,
    color: "#85899B",
    marginTop: 5,
    lineHeight: 18,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#EEF0F6",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#292D40",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#85899B",
    marginTop: 5,
    marginBottom: 18,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
    gap: 10,
  },
  dayLabel: {
    width: 52,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayName: {
    fontSize: 12,
    color: "#777D91",
  },
  dayDate: {
    fontSize: 12,
    fontWeight: "600",
    color: "#292D40",
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#EEF0F6",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#5965C9",
    borderRadius: 10,
  },
  dayCount: {
    width: 18,
    textAlign: "right",
    color: "#777D91",
    fontSize: 12,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F6",
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#292D40",
  },
  habitSubtitle: {
    fontSize: 12,
    color: "#85899B",
    marginTop: 4,
  },
  streak: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C66B1B",
  },
  emptyText: {
    color: "#85899B",
    fontSize: 13,
    marginTop: 15,
  },
});