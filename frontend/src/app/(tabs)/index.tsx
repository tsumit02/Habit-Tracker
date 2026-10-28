import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Plus,
  Sparkles,
} from "lucide-react-native";
import { useHabits } from "../../context/HabitContext";
import { ApiError } from "../../services/api";
import { spacing, typography, useAppTheme } from "../../theme";
import ScenicBackground from "../../components/layout/ScenicBackground";
import AppCard from "../../components/ui/AppCard";

function ProgressRing({ percentage }: { percentage: number }) {
  const size = 112;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFFFFF"
          strokeOpacity={0.28}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFFFFF"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - percentage / 100)}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
          fill="none"
        />
      </Svg>

      <View
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 27, fontWeight: "800" }}>
          {percentage}%
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.82)", fontSize: 10 }}>
          completed
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { habits, toggleHabit } = useHabits();
  const { colors, isDark } = useAppTheme();

  const handleToggleHabit = async (habitId: string) => {
    try {
      await toggleHabit(habitId);
    } catch (error) {
      console.error("[Habits] Toggle failed:", error);

      Alert.alert(
        "Couldn't update habit",
        error instanceof ApiError
          ? error.message
          : "We couldn't update your progress. Please try again.",
      );
    }
  };

  const completedCount = habits.filter((habit) => habit.completed).length;
  const totalCount = habits.length;
  const percentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const tileColors = isDark
    ? ["#353C56", "#493B36", "#403752", "#493344", "#2D4844"]
    : ["#E1F4FF", "#FFF0DC", "#EDE6FF", "#FFE6EF", "#DDF8EF"];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <ScenicBackground height={315}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: spacing.screenHorizontal,
            paddingTop: Math.max(insets.top, 8) + 8,
            paddingBottom: 125 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Scenic header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: isDark ? "#F0EAFE" : "#514B78",
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                A little progress every day 🌱
              </Text>

              <Text
                style={{
                  color: isDark ? "#FFFFFF" : "#282548",
                  fontSize: 30,
                  fontWeight: "800",
                  letterSpacing: -0.8,
                  marginTop: 5,
                }}
              >
                Hello, there 👋
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 9,
                }}
              >
                <CalendarDays
                  size={15}
                  color={isDark ? "#E3DFFF" : "#5E5A82"}
                />
                <Text
                  style={{
                    color: isDark ? "#E3DFFF" : "#5E5A82",
                    fontSize: 12,
                    marginLeft: 7,
                    fontWeight: "500",
                  }}
                >
                  {formattedDate}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push("/about")}
              accessibilityRole="button"
              accessibilityLabel="About Habit Tracker"
              style={{
                width: 50,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 18,
                borderWidth: 1,
                borderColor: isDark
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(255,255,255,0.9)",
                backgroundColor: isDark
                  ? "rgba(34,34,59,0.85)"
                  : "rgba(255,255,255,0.82)",
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 24,
                  fontWeight: "800",
                }}
              >
                H
              </Text>
            </Pressable>
          </View>

          {/* Daily progress */}
          <View
            style={{
              marginBottom: 28,
              padding: 20,
              borderRadius: 28,
              overflow: "hidden",
              backgroundColor: isDark ? "#51468F" : "#7167F5",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.35)",
              shadowColor: "#5147D9",
              shadowOffset: { width: 0, height: 7 },
              shadowOpacity: 0.18,
              shadowRadius: 16,
              elevation: 5,
            }}
          >
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                width: 150,
                height: 150,
                borderRadius: 75,
                right: -55,
                top: -65,
                backgroundColor: "#B9C7FF",
                opacity: 0.25,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 22,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    backgroundColor: "rgba(255,255,255,0.19)",
                  }}
                >
                  <Sparkles color="#FFFFFF" size={19} />
                </View>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 11,
                    fontWeight: "800",
                    letterSpacing: 1,
                    marginLeft: 10,
                  }}
                >
                  YOUR DAILY JOURNEY
                </Text>
              </View>

              <View
                style={{
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.35)",
                  backgroundColor: "rgba(255,255,255,0.13)",
                  paddingHorizontal: 11,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 10,
                    fontWeight: "700",
                  }}
                >
                  TODAY
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ProgressRing percentage={percentage} />

              <View style={{ marginLeft: 18, flex: 1 }}>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 22,
                    fontWeight: "800",
                  }}
                >
                  {totalCount > 0 && percentage === 100
                    ? "Amazing work!"
                    : "Keep growing!"}
                </Text>

                <Text
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 13,
                    lineHeight: 20,
                    marginTop: 7,
                  }}
                >
                  {completedCount} of {totalCount} habits completed
                </Text>

                <Text
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 11,
                    lineHeight: 17,
                    marginTop: 8,
                  }}
                >
                  {percentage === 100 && totalCount > 0
                    ? "You showed up for yourself today! 🎉"
                    : "Little steps create big changes ✨"}
                </Text>
              </View>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: "rgba(255,255,255,0.22)",
                marginTop: 22,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 14,
              }}
            >
              <Text
                style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}
              >
                Daily consistency
              </Text>
              <Text
                style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "700" }}
              >
                {completedCount}/{totalCount} completed
              </Text>
            </View>
          </View>

          {/* Today's habits */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 17,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 24,
                  fontWeight: "800",
                  letterSpacing: -0.6,
                }}
              >
                Today's habits
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  marginTop: 5,
                }}
              >
                Small steps make big changes.
              </Text>
            </View>

            <View
              style={{
                marginLeft: 10,
                borderRadius: 15,
                backgroundColor: colors.primaryLight,
                paddingHorizontal: 14,
                paddingVertical: 11,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 15,
                  fontWeight: "800",
                }}
              >
                {completedCount}/{totalCount}
              </Text>
            </View>
          </View>

          {/* Empty state */}
          {totalCount === 0 && (
            <AppCard
              style={{
                alignItems: "center",
                marginBottom: 14,
                paddingVertical: 28,
              }}
            >
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.primaryLight,
                  marginBottom: 15,
                }}
              >
                <Text style={{ fontSize: 34 }}>🌱</Text>
              </View>

              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  fontWeight: "800",
                }}
              >
                Start something wonderful
              </Text>

              <Text
                style={{
                  color: colors.textSecondary,
                  textAlign: "center",
                  fontSize: 13,
                  lineHeight: 21,
                  marginTop: 8,
                }}
              >
                Create your first habit and begin building your daily routine.
              </Text>
            </AppCard>
          )}

          {/* Habit list */}
          {habits.map((habit, index) => (
            <View
              key={habit.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 11,
                padding: 12,
                borderRadius: 23,
                borderWidth: 1,
                borderColor: habit.completed
                  ? colors.successLight
                  : colors.border,
                backgroundColor: habit.completed
                  ? colors.successLight
                  : colors.surface,
                shadowColor: "#454064",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: isDark ? 0.08 : 0.035,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/add-habit",
                    params: { id: habit.id },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`Edit ${habit.title}`}
                style={{
                  width: 54,
                  height: 54,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 18,
                  backgroundColor: habit.completed
                    ? colors.successLight
                    : tileColors[index % tileColors.length],
                }}
              >
                <Text style={{ fontSize: 26 }}>{habit.emoji}</Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/add-habit",
                    params: { id: habit.id },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`Edit ${habit.title}`}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  marginLeft: 12,
                  paddingVertical: 4,
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: habit.completed ? colors.success : colors.text,
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  {habit.title}
                </Text>

                <Text
                  numberOfLines={2}
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    lineHeight: 18,
                    marginTop: 4,
                  }}
                >
                  {habit.subtitle}
                </Text>

                {habit.completed && (
                  <Text
                    style={{
                      color: colors.success,
                      fontSize: 10,
                      fontWeight: "700",
                      marginTop: 4,
                    }}
                  >
                    Completed today
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => handleToggleHabit(habit.id)}
                accessibilityRole="checkbox"
                accessibilityLabel={`Mark ${habit.title} as ${
                  habit.completed ? "incomplete" : "complete"
                }`}
                accessibilityState={{ checked: habit.completed }}
                style={{
                  width: 38,
                  height: 38,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 19,
                  marginLeft: 8,
                  backgroundColor: habit.completed
                    ? colors.success
                    : colors.surfaceSecondary,
                  borderWidth: habit.completed ? 0 : 1.5,
                  borderColor: colors.border,
                }}
              >
                {habit.completed ? (
                  <Check size={20} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <View
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 4,
                      backgroundColor: colors.textMuted,
                    }}
                  />
                )}
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/add-habit",
                    params: { id: habit.id },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`Edit ${habit.title}`}
                style={{ padding: 6, marginLeft: 2 }}
              >
                <ChevronRight size={19} color={colors.textMuted} />
              </Pressable>
            </View>
          ))}

          {/* Add habit */}
          <Pressable
            onPress={() => router.push("/add-habit")}
            accessibilityRole="button"
            style={({ pressed }) => ({
              minHeight: 57,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 5,
              paddingHorizontal: 20,
              borderRadius: 21,
              backgroundColor: colors.primary,
              opacity: pressed ? 0.86 : 1,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 4,
            })}
          >
            <Plus size={21} color="#FFFFFF" strokeWidth={2.5} />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: "800",
                marginLeft: 9,
              }}
            >
              Add a new habit
            </Text>
          </Pressable>

          <View style={{ alignItems: "center", marginTop: 25 }}>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 12,
                fontWeight: "500",
              }}
            >
              Made for your growth 💜
            </Text>
          </View>
        </ScrollView>
      </ScenicBackground>
    </SafeAreaView>
  );
}
