
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
      isToday: index === 6,
    };
  });
}

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
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
    <SafeAreaView className="flex-1 bg-[#F7F8FC]">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F8FC"
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingTop: Math.max(insets.top, 12) + 8,
          paddingBottom: 36,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-7">
          <View className="flex-row items-center">
            <Text className="text-[30px] font-extrabold tracking-tight text-[#20243A]">
              Your Progress
            </Text>
            <Text className="ml-2 text-[27px]">📈</Text>
          </View>

          <Text className="mt-2 text-sm text-[#858BA1]">
            Every small step counts.
          </Text>
        </View>

        {/* Today's completion */}
        <View className="mb-5 overflow-hidden rounded-[28px] bg-[#5965C9] p-6">
          <View className="mb-5 flex-row items-center justify-between">
            <View className="rounded-full bg-white/15 px-3 py-2">
              <Text className="text-[10px] font-bold tracking-[1.4px] text-white">
                TODAY'S COMPLETION
              </Text>
            </View>

            <Text className="text-2xl">
              {completionRate === 100 && totalHabits > 0
                ? "🎉"
                : "✨"}
            </Text>
          </View>

          <View className="mb-5 flex-row items-end justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[44px] font-extrabold text-white">
                {completionRate}%
              </Text>

              <Text className="mt-1 text-sm leading-5 text-[#E4E7FF]">
                {completedToday} of {totalHabits} habits completed
              </Text>
            </View>

            <Text className="mb-2 text-sm font-semibold text-[#E4E7FF]">
              {completionRate === 100 && totalHabits > 0
                ? "All done!"
                : "Keep going"}
            </Text>
          </View>

          <View className="h-3 overflow-hidden rounded-full bg-[#858DE0]">
            <View
              className="h-full rounded-full bg-white"
              style={{ width: `${completionRate}%` }}
            />
          </View>

          <Text className="mt-5 text-xs leading-5 text-[#E4E7FF]">
            Progress isn't about perfection. It's about showing up.
          </Text>
        </View>

        {/* Statistics */}
        <View className="mb-6 flex-row gap-3">
          <View className="flex-1 rounded-[23px] border border-[#EAECF4] bg-white p-4">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF7EE]">
              <Text className="text-xl">✓</Text>
            </View>

            <Text className="mt-4 text-[29px] font-extrabold text-[#292D40]">
              {weeklyCompletions}
            </Text>

            <Text className="mt-1 text-xs leading-5 text-[#858BA1]">
              Completions this week
            </Text>
          </View>

          <View className="flex-1 rounded-[23px] border border-[#EAECF4] bg-white p-4">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#EAECFF]">
              <Text className="text-xl">🎯</Text>
            </View>

            <Text className="mt-4 text-[29px] font-extrabold text-[#292D40]">
              {totalHabits}
            </Text>

            <Text className="mt-1 text-xs leading-5 text-[#858BA1]">
              Total habits
            </Text>
          </View>
        </View>

        {/* Weekly activity */}
        <View className="mb-5 rounded-[26px] border border-[#EAECF4] bg-white p-5">
          <View className="mb-6">
            <Text className="text-xl font-extrabold text-[#292D40]">
              Weekly activity
            </Text>

            <Text className="mt-1.5 text-sm text-[#858BA1]">
              Your last 7 days at a glance
            </Text>
          </View>

          {dailyCounts.map((day) => {
            const barWidth = (day.count / maxCount) * 100;

            return (
              <View
                key={day.key}
                className="mb-5 flex-row items-center"
              >
                <View className="w-[58px]">
                  <Text
                    className={`text-xs font-semibold ${
                      day.isToday
                        ? "text-[#5965C9]"
                        : "text-[#858BA1]"
                    }`}
                  >
                    {day.isToday ? "Today" : day.label}
                  </Text>

                  <Text className="mt-1 text-xs text-[#A0A5B6]">
                    {day.date}
                  </Text>
                </View>

                <View className="mx-3 h-3 flex-1 overflow-hidden rounded-full bg-[#F0F1F7]">
                  {day.count > 0 && (
                    <View
                      className="h-full rounded-full bg-[#5965C9]"
                      style={{ width: `${barWidth}%` }}
                    />
                  )}
                </View>

                <View className="w-6 items-end">
                  <Text
                    className={`text-xs font-bold ${
                      day.count > 0
                        ? "text-[#5965C9]"
                        : "text-[#A0A5B6]"
                    }`}
                  >
                    {day.count}
                  </Text>
                </View>
              </View>
            );
          })}

          <View className="mt-1 flex-row items-center rounded-2xl bg-[#F5F6FF] p-3">
            <Text className="mr-2 text-base">💡</Text>
            <Text className="flex-1 text-xs leading-5 text-[#747B9A]">
              Every completed habit is a step toward your goals.
            </Text>
          </View>
        </View>

        {/* Habit history */}
        <View className="rounded-[26px] border border-[#EAECF4] bg-white p-5">
          <Text className="text-xl font-extrabold text-[#292D40]">
            Habit history
          </Text>

          <Text className="mb-4 mt-1.5 text-sm text-[#858BA1]">
            Your consistency, one habit at a time.
          </Text>

          {habits.length === 0 ? (
            <View className="items-center rounded-2xl bg-[#F7F8FC] px-4 py-7">
              <Text className="text-3xl">🌱</Text>

              <Text className="mt-3 text-sm font-bold text-[#292D40]">
                Your journey starts here
              </Text>

              <Text className="mt-2 text-center text-xs leading-5 text-[#858BA1]">
                Add your first habit to begin tracking your progress.
              </Text>
            </View>
          ) : (
            habits.map((habit, index) => {
              const currentStreak = (() => {
                let streak = 0;
                const date = new Date();

                if (!habit.completedDates.includes(todayKey)) {
                  date.setDate(date.getDate() - 1);
                }

                while (habit.completedDates.includes(getDateKey(date))) {
                  streak += 1;
                  date.setDate(date.getDate() - 1);
                }

                return streak;
              })();

              return (
                <View
                  key={habit.id}
                  className={`flex-row items-center py-4 ${
                    index < habits.length - 1
                      ? "border-b border-[#F0F1F7]"
                      : ""
                  }`}
                >
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F1FF]">
                    <Text className="text-[25px]">{habit.emoji}</Text>
                  </View>

                  <View className="ml-3 flex-1">
                    <Text
                      numberOfLines={1}
                      className="text-sm font-bold text-[#292D40]"
                    >
                      {habit.title}
                    </Text>

                    <Text className="mt-1.5 text-xs text-[#858BA1]">
                      {habit.completedDates.length} recorded days
                    </Text>
                  </View>

                  <View className="ml-2 items-center rounded-2xl bg-[#FFF4E7] px-3 py-2">
                    <Text className="text-xs font-bold text-[#C66B1B]">
                      🔥 {currentStreak}
                    </Text>

                    <Text className="mt-1 text-[9px] font-medium text-[#C66B1B]">
                      DAY STREAK
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <Text className="mt-7 text-center text-xs text-[#A0A5B6]">
          Keep growing, one day at a time ✨
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
