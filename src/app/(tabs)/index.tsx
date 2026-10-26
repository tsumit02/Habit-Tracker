
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Svg, { Circle } from "react-native-svg";
import {
  // ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Plus,
  Sparkles,
} from "lucide-react-native";
import { useHabits } from "../../context/HabitContext";
import { ApiError } from "../../services/api";

const { habits, toggleHabit } = useHabits();

const handleToggleHabit = async (habitId: string) => {
  try {
    await toggleHabit(habitId);
  } catch (error) {
    console.error("[Habits] Toggle failed:", error);

    Alert.alert(
      "Couldn't update habit",
      error instanceof ApiError
        ? error.message
        : "We couldn't update your progress. Please try again."
    );
  }
};

const C = {
  bg: "#F5F5FF",
  ink: "#202044",
  muted: "#8589A8",
  purple: "#6258F5",
  blue: "#8988FF",
  border: "#E9E9F7",
};

function ProgressRing({
  percentage,
}: {
  percentage: number;
}) {
  const size = 112;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View className="items-center justify-center">
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

      <View className="absolute items-center justify-center">
        <Text className="text-[27px] font-extrabold text-white">
          {percentage}%
        </Text>
        <Text className="text-[10px] font-medium text-white/80">
          completed
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { habits, toggleHabit } = useHabits();

  const completedCount = habits.filter(
    (habit) => habit.completed
  ).length;

  const totalCount = habits.length;

  const percentage =
    totalCount === 0
      ? 0
      : Math.round((completedCount / totalCount) * 100);

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5FF]">
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.bg}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: Math.max(insets.top, 8) + 4,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-sm font-medium text-[#8589A8]">
              Good day to grow 🌱
            </Text>

            <Text className="mt-1 text-[29px] font-extrabold tracking-tight text-[#202044]">
              Hello, there 👋
            </Text>

            <View className="mt-2 flex-row items-center">
              <CalendarDays
                size={14}
                color={C.muted}
                strokeWidth={2}
              />
              <Text className="ml-2 text-xs text-[#8589A8]">
                {formattedDate}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/about")}
            accessibilityRole="button"
            accessibilityLabel="About Habit Tracker"
            className="h-[52px] w-[52px] items-center justify-center rounded-[19px] border border-white bg-[#E6E6FF]"
            style={{
              shadowColor: "#6258F5",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.09,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            <Text className="text-[25px] font-extrabold text-[#6258F5]">
              H
            </Text>
          </Pressable>
        </View>

        {/* Glass-inspired progress card */}
        <View
          className="mb-7 overflow-hidden rounded-[30px] border border-white bg-[#7167FA] p-5"
          style={{
            shadowColor: "#6258F5",
            shadowOffset: { width: 0, height: 9 },
            shadowOpacity: 0.20,
            shadowRadius: 18,
            elevation: 6,
          }}
        >
          {/* Decorative pastel shapes */}
          <View
            pointerEvents="none"
            className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-[#B5C5FF]"
            style={{ opacity: 0.35 }}
          />
          <View
            pointerEvents="none"
            className="absolute -bottom-14 -left-8 h-36 w-36 rounded-full bg-[#D6B9FF]"
            style={{ opacity: 0.35 }}
          />

          <View className="mb-6 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                <Sparkles color="#FFFFFF" size={19} />
              </View>

              <Text className="ml-3 text-[12px] font-bold tracking-[1.2px] text-white">
                YOUR DAILY JOURNEY
              </Text>
            </View>

            <View className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5">
              <Text className="text-[10px] font-semibold text-white">
                TODAY
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <ProgressRing percentage={percentage} />

            <View className="ml-5 flex-1">
              <Text className="text-[23px] font-extrabold text-white">
                {totalCount > 0 && percentage === 100
                  ? "Amazing work!"
                  : "Keep growing!"}
              </Text>

              <Text className="mt-2 text-sm leading-5 text-white/90">
                {completedCount} of {totalCount} habits completed
              </Text>

              <Text className="mt-3 text-xs leading-5 text-white/80">
                {percentage === 100 && totalCount > 0
                  ? "You showed up for yourself today! 🎉"
                  : "Little steps create big changes ✨"}
              </Text>
            </View>
          </View>

          <View className="mt-6 h-px bg-white/20" />

          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-xs text-white/90">
              Daily consistency
            </Text>

            <Text className="text-xs font-bold text-white">
              {completedCount}/{totalCount} completed
            </Text>
          </View>
        </View>

        {/* Today's habits */}
        <View className="mb-5 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-[24px] font-extrabold tracking-tight text-[#202044]">
              Today's habits
            </Text>

            <Text className="mt-1.5 text-sm text-[#8589A8]">
              Small steps make big changes.
            </Text>
          </View>

          <View className="ml-3 rounded-2xl border border-white bg-[#E9E8FF] px-4 py-3">
            <Text className="text-base font-extrabold text-[#6258F5]">
              {completedCount}/{totalCount}
            </Text>
          </View>
        </View>

        {/* Empty state */}
        {totalCount === 0 && (
          <View className="mb-4 items-center rounded-[26px] border border-white bg-white/90 px-6 py-8">
            <View className="mb-4 h-[76px] w-[76px] items-center justify-center rounded-[26px] bg-[#F0EAFE]">
              <Text className="text-[36px]">🌱</Text>
            </View>

            <Text className="text-lg font-bold text-[#202044]">
              Start something wonderful
            </Text>

            <Text className="mt-2 text-center text-sm leading-6 text-[#8589A8]">
              Create your first habit and begin building your daily routine.
            </Text>
          </View>
        )}

        {/* Habit cards */}
        {habits.map((habit, index) => {
          const tileColors = [
            "#E1F4FF",
            "#FFF0DC",
            "#EDE6FF",
            "#FFE6EF",
            "#DDF8EF",
          ];

          return (
            <View
              key={habit.id}
              className={`mb-3 flex-row items-center rounded-[25px] border p-3.5 ${
                habit.completed
                  ? "border-[#D4F0E1] bg-[#F6FFF9]"
                  : "border-white bg-white"
              }`}
              style={{
                shadowColor: "#56558C",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.045,
                shadowRadius: 9,
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
                className="h-[55px] w-[55px] items-center justify-center rounded-[19px]"
                style={{
                  backgroundColor: habit.completed
                    ? "#DDF6E8"
                    : tileColors[index % tileColors.length],
                }}
              >
                <Text className="text-[27px]">{habit.emoji}</Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/add-habit",
                    params: { id: habit.id },
                  })
                }
                accessibilityRole="button"
                className="ml-3.5 flex-1 justify-center py-1"
              >
                <Text
                  numberOfLines={1}
                  className={`text-[15px] font-bold ${
                    habit.completed
                      ? "text-[#39845D]"
                      : "text-[#242442]"
                  }`}
                >
                  {habit.title}
                </Text>

                <Text
                  numberOfLines={2}
                  className="mt-1 text-xs leading-5 text-[#8589A8]"
                >
                  {habit.subtitle}
                </Text>

                {habit.completed && (
                  <Text className="mt-1 text-[10px] font-semibold text-[#39845D]">
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
                className={`ml-2 h-10 w-10 items-center justify-center rounded-full ${
                  habit.completed
                    ? "bg-[#2FBD76]"
                    : "border-2 border-[#D8DBEA] bg-[#FAFAFF]"
                }`}
              >
                {habit.completed ? (
                  <Check size={21} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <View className="h-2 w-2 rounded-full bg-[#D8DBEA]" />
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
                className="ml-1 p-1"
              >
                <ChevronRight size={19} color="#A2A6C0" />
              </Pressable>
            </View>
          );
        })}

        {/* Add habit */}
        <Pressable
          onPress={() => router.push("/add-habit")}
          accessibilityRole="button"
          className="mt-2 flex-row items-center justify-center rounded-[23px] bg-[#6258F5] px-5 py-[18px]"
          style={{
            shadowColor: "#6258F5",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.20,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <Plus size={21} color="#FFFFFF" strokeWidth={2.5} />

          <Text className="ml-2 text-[15px] font-bold text-white">
            Add a new habit
          </Text>
        </Pressable>

        {/* Progress shortcut
        <Pressable
          onPress={() => router.push("/progress")}
          accessibilityRole="button"
          className="mt-4 flex-row items-center rounded-[24px] border border-white bg-white/90 p-4"
        >
          <View className="h-12 w-12 items-center justify-center rounded-[17px] bg-[#EAE8FF]">
            <Text className="text-[23px]">📈</Text>
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-[15px] font-bold text-[#242442]">
              Your progress
            </Text>

            <Text className="mt-1 text-xs text-[#8589A8]">
              Look how far you've come
            </Text>
          </View>

          <ArrowRight size={19} color={C.purple} />
        </Pressable> */}

        {/* Footer */}
        <View className="mt-7 items-center">
          <Text className="text-xs font-medium text-[#969AB4]">
            Made for your growth 💜
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
