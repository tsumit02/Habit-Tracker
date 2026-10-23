import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { useHabits } from "../../context/HabitContext";

export default function HomeScreen() {
  // Get habits and functions from shared context
  const { habits, toggleHabit } = useHabits();

  // Calculate completed habits
  const completedCount = habits.filter(
    (habit) => habit.completed
  ).length;

  const totalCount = habits.length;

  const progress =
    totalCount === 0 ? 0 : completedCount / totalCount;

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, there 👋</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>H</Text>
          </View>
        </View>

        {/* Progress card */}
        <View style={styles.progressCard}>
          <Text style={styles.cardLabel}>YOUR DAILY PROGRESS</Text>

          <View style={styles.progressRow}>
            <View>
              <Text style={styles.progressTitle}>Keep it up!</Text>
              <Text style={styles.progressSubtitle}>
                {completedCount} of {totalCount} habits completed
              </Text>
            </View>

            <Text style={styles.percentage}>
              {Math.round(progress * 100)}%
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%` },
              ]}
            />
          </View>

          <Text style={styles.motivation}>
            Small steps lead to big changes.
          </Text>
        </View>

        {/* Today's habits */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Today's habits</Text>
            <Text style={styles.sectionSubtitle}>
              Build a better you, one day at a time.
            </Text>
          </View>

          <Text style={styles.counter}>
            {completedCount}/{totalCount}
          </Text>
        </View>

        {/* Habit list */}
        {habits.map((habit) => (
          <Pressable
            key={habit.id}
            onPress={() =>
              router.push({
                pathname: "/add-habit",
                params: { id: habit.id },
              })
            }
            style={[
              styles.habitCard,
              habit.completed && styles.completedCard,
            ]}
          >
            <View style={styles.habitEmoji}>
              <Text style={styles.emojiText}>{habit.emoji}</Text>
            </View>

            <View style={styles.habitInfo}>
              <Text
                style={[
                  styles.habitTitle,
                  habit.completed && styles.completedText,
                ]}
              >
                {habit.title}
              </Text>

              <Text style={styles.habitSubtitle}>
                {habit.subtitle}
              </Text>
            </View>

            <Pressable
              onPress={() => toggleHabit(habit.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: habit.completed }}
              style={[
                styles.checkButton,
                habit.completed && styles.checkedButton,
              ]}
            >
              <Text
                style={[
                  styles.checkText,
                  habit.completed && styles.checkedText,
                ]}
              >
                {habit.completed ? "✓" : "+"}
              </Text>
            </Pressable>
          </Pressable>
        ))}

        {/* Navigate to Add Habit screen */}
        <Pressable
          onPress={() => router.push("/add-habit")}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>
            +  Add a new habit
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/progress")}
          style={styles.progressButton}
        >
          <Text style={styles.progressButtonText}>
            View My Progress 📈
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          Consistency over perfection ✨
        </Text>
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },
  greeting: {
    fontSize: 25,
    fontWeight: "700",
    color: "#20243A",
  },
  date: {
    fontSize: 14,
    color: "#85899B",
    marginTop: 6,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E2E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5965C9",
  },
  progressCard: {
    backgroundColor: "#5965C9",
    borderRadius: 22,
    padding: 22,
    marginBottom: 30,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    color: "#DCE0FF",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 18,
  },
  progressTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "700",
  },
  progressSubtitle: {
    color: "#E0E3FF",
    fontSize: 13,
    marginTop: 7,
  },
  percentage: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "700",
  },
  progressTrack: {
    height: 9,
    borderRadius: 10,
    backgroundColor: "#858DE0",
    overflow: "hidden",
  },
    progressButton: {
    backgroundColor: "#E9EBFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },

  progressButtonText: {
    color: "#5965C9",
    fontSize: 15,
    fontWeight: "600",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  motivation: {
    marginTop: 15,
    color: "#E0E3FF",
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 17,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#20243A",
  },
  sectionSubtitle: {
    color: "#85899B",
    fontSize: 12,
    marginTop: 6,
  },
  counter: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5965C9",
    backgroundColor: "#E9EBFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEF0F6",
  },
  completedCard: {
    backgroundColor: "#F0F8F3",
    borderColor: "#D7EDDF",
  },
  habitEmoji: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F1F2FA",
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontSize: 23,
  },
  habitInfo: {
    flex: 1,
    marginLeft: 13,
  },
  habitTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#292D40",
  },
  completedText: {
    color: "#4B8B68",
  },
  habitSubtitle: {
    fontSize: 12,
    color: "#9296A6",
    marginTop: 5,
  },
  checkButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D8DCEC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkedButton: {
    backgroundColor: "#4BA875",
    borderColor: "#4BA875",
  },
  checkText: {
    fontSize: 23,
    color: "#7B82A0",
    lineHeight: 27,
  },
  checkedText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },
  addButton: {
    borderWidth: 1.5,
    borderColor: "#5965C9",
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 7,
  },
  addButtonText: {
    color: "#5965C9",
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    textAlign: "center",
    color: "#A0A3B1",
    fontSize: 12,
    marginTop: 25,
  },
});