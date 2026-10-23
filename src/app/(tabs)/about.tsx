
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const features = [
  {
    emoji: "🎯",
    title: "Build better habits",
    description: "Create routines that fit your everyday life.",
    color: "bg-[#EAECFF]",
  },
  {
    emoji: "📈",
    title: "Track your progress",
    description: "See your completed habits and weekly activity.",
    color: "bg-[#EAF7EE]",
  },
  {
    emoji: "🔥",
    title: "Stay consistent",
    description: "Keep track of your streaks and celebrate progress.",
    color: "bg-[#FFF1E3]",
  },
];

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

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
          <Text className="text-[30px] font-extrabold tracking-tight text-[#20243A]">
            About
          </Text>
          <Text className="mt-2 text-sm text-[#858BA1]">
            A little about your habit journey.
          </Text>
        </View>

        {/* App identity */}
        <View className="mb-6 items-center overflow-hidden rounded-[28px] bg-[#5965C9] px-6 py-8">
          <View className="mb-5 h-[92px] w-[92px] items-center justify-center rounded-[30px] border border-white/20 bg-white/15">
            <Text className="text-[48px] font-extrabold text-white">
              H
            </Text>
          </View>

          <Text className="text-[27px] font-extrabold text-white">
            Habit Tracker
          </Text>

          <Text className="mt-2 text-center text-sm leading-6 text-[#E4E7FF]">
            Small steps. Better routines. A stronger you.
          </Text>

          <View className="mt-5 rounded-full border border-white/25 px-4 py-2">
            <Text className="text-xs font-semibold text-white">
              YOUR DAILY GROWTH COMPANION
            </Text>
          </View>
        </View>

        {/* Mission */}
        <View className="mb-5 rounded-[24px] border border-[#EAECF4] bg-white p-5">
          <View className="mb-3 flex-row items-center">
            <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-[#EAECFF]">
              <Text className="text-xl">💜</Text>
            </View>

            <Text className="text-lg font-extrabold text-[#292D40]">
              Our purpose
            </Text>
          </View>

          <Text className="text-sm leading-6 text-[#747B91]">
            Great changes begin with small actions. Habit Tracker helps
            you build daily routines, record your progress, and stay
            mindful of the goals that matter to you.
          </Text>
        </View>

        {/* Features */}
        <View className="mb-5">
          <Text className="text-xl font-extrabold text-[#292D40]">
            What you can do
          </Text>

          <Text className="mb-4 mt-1.5 text-sm text-[#858BA1]">
            Everything you need to stay on track.
          </Text>

          {features.map((feature) => (
            <View
              key={feature.title}
              className="mb-3 flex-row items-center rounded-[23px] border border-[#EAECF4] bg-white p-4"
            >
              <View
                className={`h-[54px] w-[54px] items-center justify-center rounded-[18px] ${feature.color}`}
              >
                <Text className="text-[27px]">{feature.emoji}</Text>
              </View>

              <View className="ml-4 flex-1">
                <Text className="text-[15px] font-bold text-[#292D40]">
                  {feature.title}
                </Text>

                <Text className="mt-1.5 text-xs leading-5 text-[#858BA1]">
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Motivation */}
        <View className="mb-5 rounded-[24px] border border-[#E6E8FA] bg-[#F0F1FF] p-5">
          <Text className="text-lg font-extrabold text-[#414CA9]">
            A reminder for you ✨
          </Text>

          <Text className="mt-2 text-sm leading-6 text-[#626B9A]">
            You don't have to be perfect. Just keep showing up,
            one day at a time.
          </Text>
        </View>

        {/* App information */}
        <View className="rounded-[24px] border border-[#EAECF4] bg-white p-5">
          <Text className="text-lg font-extrabold text-[#292D40]">
            App information
          </Text>

          <View className="mt-4 flex-row items-center justify-between border-b border-[#F0F1F7] pb-4">
            <Text className="text-sm text-[#858BA1]">
              Application
            </Text>
            <Text className="text-sm font-semibold text-[#292D40]">
              Habit Tracker
            </Text>
          </View>

          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-sm text-[#858BA1]">
              Version
            </Text>
            <Text className="text-sm font-semibold text-[#292D40]">
              1.0.0
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-sm font-semibold text-[#5965C9]">
            Made for your growth 💜
          </Text>

          <Text className="mt-2 text-xs text-[#A0A5B6]">
            Consistency over perfection.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
