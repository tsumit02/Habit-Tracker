import {
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import {
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  Flame,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react-native";

import { AppCard } from "../../components/ui";
import { useHabits } from "../../context/HabitContext";
import { colors, spacing } from "../../theme";
import styles from "../../styles/progress.styles";

const RING_SIZE = 116;
const RING_STROKE = 10;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

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
      isToday: index === 6,
    };
  });
}

function ProgressRing({ percentage }: { percentage: number }) {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  return (
    <View style={styles.ringContainer}>
      <Svg
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      >
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={colors.primaryLight}
          strokeWidth={RING_STROKE}
          fill="none"
        />

        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke={colors.primary}
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={`${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
          strokeDashoffset={
            RING_CIRCUMFERENCE * (1 - safePercentage / 100)
          }
          rotation={-90}
          origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
          fill="none"
        />
      </Svg>

      <View style={styles.ringCenter}>
        <Text style={styles.ringPercentage}>{safePercentage}%</Text>
        <Text style={styles.ringCaption}>complete</Text>
      </View>
    </View>
  );
}

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { habits } = useHabits();

  const days = getLastSevenDays();
  const todayKey = getDateKey(new Date());
  const totalHabits = habits.length;

  const completedToday = habits.filter((habit) =>
    habit.completedDates.includes(todayKey)
  ).length;

  const completionRate =
    totalHabits === 0
      ? 0
      : Math.round((completedToday / totalHabits) * 100);

  const dailyCounts = days.map((day) => ({
    ...day,
    count: habits.filter((habit) =>
      habit.completedDates.includes(day.key)
    ).length,
  }));

  const weeklyCompletions = dailyCounts.reduce(
    (total, day) => total + day.count,
    0
  );

  const maxCount = Math.max(
    ...dailyCounts.map((day) => day.count),
    1
  );

  const currentStreak = (dates: string[]) => {
    let streak = 0;
    const date = new Date();

    if (!dates.includes(todayKey)) {
      date.setDate(date.getDate() - 1);
    }

    while (dates.includes(getDateKey(date))) {
      streak += 1;
      date.setDate(date.getDate() - 1);
    }

    return streak;
  };

  const bestCurrentStreak = Math.max(
    0,
    ...habits.map((habit) => currentStreak(habit.completedDates))
  );

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: Math.max(insets.top, spacing.sm) },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, spacing.xxl) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.screenTitle}>Your Progress</Text>

            <ChartNoAxesCombined
              size={25}
              color={colors.primary}
              strokeWidth={2.5}
              style={styles.headerIcon}
            />
          </View>

          <Text style={styles.subtitle}>
            Every small step counts.
          </Text>
        </View>

        {/* Today's completion */}
        <AppCard style={[styles.card, styles.overviewCard]}>
          <View style={styles.decorationTop} />
          <View style={styles.decorationBottom} />

          <View style={styles.sectionHeading}>
            <View
              style={[
                styles.sectionIcon,
                styles.sectionIconPurple,
              ]}
            >
              <CalendarDays size={20} color={colors.primary} />
            </View>

            <View style={styles.sectionText}>
              <Text style={styles.sectionTitle}>
                Today's completion
              </Text>
              <Text style={styles.sectionSubtitle}>
                Your daily goals at a glance
              </Text>
            </View>
          </View>

          <View style={styles.overviewBody}>
            <ProgressRing percentage={completionRate} />

            <View style={styles.overviewDetails}>
              <Text style={styles.overviewCount}>
                {completedToday} of {totalHabits}
              </Text>

              <Text style={styles.overviewAccent}>
                habits completed
              </Text>

              <Text style={styles.overviewMessage}>
                {totalHabits > 0 && completionRate === 100
                  ? "Amazing! You've completed every habit today. 🎉"
                  : "Keep going! Every little action matters. 💪"}
              </Text>
            </View>
          </View>
        </AppCard>

        {/* Statistics */}
        <View style={styles.statsRow}>
          <AppCard padding={spacing.md} style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                styles.sectionIconGreen,
              ]}
            >
              <Check
                size={22}
                color={colors.success}
                strokeWidth={3}
              />
            </View>

            <Text style={styles.statValue}>
              {weeklyCompletions}
            </Text>

            <Text style={styles.statLabel}>
              Completions this week
            </Text>
          </AppCard>

          <AppCard padding={spacing.md} style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                styles.sectionIconOrange,
              ]}
            >
              <Flame
                size={22}
                color={colors.orange}
                strokeWidth={2.4}
              />
            </View>

            <Text style={styles.statValue}>
              {bestCurrentStreak}
            </Text>

            <Text style={styles.statLabel}>
              Best current streak
            </Text>
          </AppCard>

          <AppCard padding={spacing.md} style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                styles.sectionIconPurple,
              ]}
            >
              <Target
                size={22}
                color={colors.primary}
                strokeWidth={2.4}
              />
            </View>

            <Text style={styles.statValue}>
              {totalHabits}
            </Text>

            <Text style={styles.statLabel}>
              Total habits
            </Text>
          </AppCard>
        </View>

        {/* Weekly activity chart */}
        <AppCard style={styles.card}>
          <View style={styles.sectionHeading}>
            <View
              style={[
                styles.sectionIcon,
                styles.sectionIconPurple,
              ]}
            >
              <TrendingUp size={21} color={colors.primary} />
            </View>

            <View style={styles.sectionText}>
              <Text style={styles.sectionTitle}>
                Weekly activity
              </Text>
              <Text style={styles.sectionSubtitle}>
                Completed habits per day
              </Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            {dailyCounts.map((day) => {
              const height =
                day.count === 0
                  ? 4
                  : Math.max(10, (day.count / maxCount) * 105);

              return (
                <View key={day.key} style={styles.chartColumn}>
                  <Text
                    style={[
                      styles.chartCount,
                      day.count > 0
                        ? styles.chartCountActive
                        : styles.chartCountInactive,
                    ]}
                  >
                    {day.count}
                  </Text>

                  <View
                    style={[
                      styles.chartBar,
                      {
                        height,
                        backgroundColor: day.isToday
                          ? colors.primary
                          : day.count > 0
                            ? colors.lavender
                            : colors.primaryLight,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>

          <View style={styles.chartLabels}>
            {dailyCounts.map((day) => (
              <View key={day.key} style={styles.chartLabelColumn}>
                <Text
                  style={[
                    styles.chartDay,
                    day.isToday && styles.chartDayToday,
                  ]}
                >
                  {day.label}
                </Text>

                <Text
                  style={[
                    styles.chartDate,
                    day.isToday && styles.chartDateToday,
                  ]}
                >
                  {day.date}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.tipBox}>
            <View style={styles.tipIcon}>
              <Trophy size={19} color={colors.primary} />
            </View>

            <View style={styles.tipTextContainer}>
              <Text style={styles.tipTitle}>
                Small wins add up
              </Text>

              <Text style={styles.tipDescription}>
                You've logged {weeklyCompletions} habit completions
                in the last 7 days.
              </Text>
            </View>
          </View>
        </AppCard>

        {/* Habit history */}
        <AppCard>
          <View style={styles.sectionHeading}>
            <View
              style={[
                styles.sectionIcon,
                styles.sectionIconPink,
              ]}
            >
              <Flame size={21} color={colors.pink} />
            </View>

            <View style={styles.sectionText}>
              <Text style={styles.sectionTitle}>
                Habit history
              </Text>
              <Text style={styles.sectionSubtitle}>
                Your consistency over time
              </Text>
            </View>
          </View>

          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🌱</Text>

              <Text style={styles.emptyTitle}>
                Your story starts here
              </Text>

              <Text style={styles.emptyDescription}>
                Add a habit to start tracking your progress and
                streaks.
              </Text>
            </View>
          ) : (
            habits.map((habit, index) => (
              <View
                key={habit.id}
                style={[
                  styles.historyRow,
                  index === habits.length - 1 &&
                    styles.historyRowLast,
                ]}
              >
                <View style={styles.habitEmoji}>
                  <Text style={styles.habitEmojiText}>
                    {habit.emoji}
                  </Text>
                </View>

                <View style={styles.habitInfo}>
                  <Text
                    numberOfLines={1}
                    style={styles.habitTitle}
                  >
                    {habit.title}
                  </Text>

                  <Text style={styles.habitRecorded}>
                    {habit.completedDates.length} recorded days
                  </Text>
                </View>

                <View style={styles.streakBadge}>
                  <View style={styles.streakRow}>
                    <Flame
                      size={14}
                      color={colors.orange}
                      fill={colors.orange}
                    />

                    <Text style={styles.streakNumber}>
                      {currentStreak(habit.completedDates)}
                    </Text>
                  </View>

                  <Text style={styles.streakLabel}>
                    DAY STREAK
                  </Text>
                </View>
              </View>
            ))
          )}
        </AppCard>

        <Text style={styles.footer}>
          Keep growing, one day at a time ✨
        </Text>
      </ScrollView>
    </View>
  );
}