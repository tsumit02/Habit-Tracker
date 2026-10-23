
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useHabits, HabitFrequency } from "../context/HabitContext";

const emojis = ["💧", "📚", "🏃", "🧘", "💪", "🥗", "😴", "✍️"];

const weekDays = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

const weekdayValues = [1, 2, 3, 4, 5];
const allDayValues = [0, 1, 2, 3, 4, 5, 6];

export default function AddHabitScreen() {
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits();

  const { id } = useLocalSearchParams<{ id?: string }>();
  const habitId = Array.isArray(id) ? id[0] : id;
  const isEditing = typeof habitId === "string" && habitId.length > 0;

  const existingHabit = isEditing
    ? habits.find((habit) => habit.id === habitId)
    : undefined;

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [emoji, setEmoji] = useState("⭐");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [selectedDays, setSelectedDays] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6,
  ]);

  useEffect(() => {
    if (!existingHabit) return;

    setTitle(existingHabit.title);
    setSubtitle(existingHabit.subtitle);
    setEmoji(existingHabit.emoji);
    setFrequency(existingHabit.frequency);
    setSelectedDays(existingHabit.scheduledDays);
  }, [existingHabit]);

  const handleFrequencyChange = (newFreq: HabitFrequency) => {
    setFrequency(newFreq);

    if (newFreq === "daily") {
      setSelectedDays(allDayValues);
    } else if (newFreq === "weekdays") {
      setSelectedDays(weekdayValues);
    }
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleSave = () => {
    const habitTitle = title.trim();

    if (!habitTitle) {
      Alert.alert("Habit name required", "Please enter a habit name.");
      return;
    }

    const scheduledDays =
      frequency === "daily"
        ? allDayValues
        : frequency === "weekdays"
          ? weekdayValues
          : selectedDays;

    if (scheduledDays.length === 0) {
      Alert.alert(
        "Select at least one day",
        "Choose one or more days for your custom habit."
      );
      return;
    }

    if (isEditing && existingHabit) {
      updateHabit(
        existingHabit.id,
        habitTitle,
        subtitle.trim(),
        emoji,
        frequency,
        scheduledDays
      );
    } else {
      addHabit(
        habitTitle,
        subtitle.trim(),
        emoji,
        frequency,
        scheduledDays
      );
    }

    router.back();
  };

  const handleDelete = () => {
    if (!existingHabit) return;

    Alert.alert(
      "Delete habit?",
      `Are you sure you want to delete "${existingHabit.title}"? This will also remove its completion history.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteHabit(existingHabit.id);
            router.back();
          },
        },
      ]
    );
  };

  const inputClass =
    "rounded-[14px] border border-[#E6E8F0] bg-white px-[15px] py-[15px] text-[15px] text-[#20243A]";

  const labelClass =
    "mb-3 mt-[22px] text-[15px] font-semibold text-[#292D40]";

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FC]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 22, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className="mt-3 text-[26px] font-bold text-[#20243A]">
            {isEditing ? "Edit Habit" : "Create a new habit"}
          </Text>

          <Text className="mb-[15px] mt-[9px] text-sm leading-[21px] text-[#85899B]">
            Start small. Stay consistent. Build a better you.
          </Text>

          <Text className={labelClass}>Choose an icon</Text>

          <View className="flex-row flex-wrap gap-3">
            {emojis.map((item) => (
              <Pressable
                key={item}
                onPress={() => setEmoji(item)}
                accessibilityRole="radio"
                accessibilityState={{ selected: emoji === item }}
                className={`h-[54px] w-[54px] items-center justify-center rounded-[15px] border bg-white ${
                  emoji === item
                    ? "border-2 border-[#5965C9] bg-[#E9EBFF]"
                    : "border-[#E6E8F0]"
                }`}
              >
                <Text className="text-[25px]">{item}</Text>
              </Pressable>
            ))}
          </View>

          <Text className={labelClass}>Habit name *</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Drink more water"
            placeholderTextColor="#999EAD"
            className={inputClass}
            maxLength={60}
            returnKeyType="next"
          />

          <Text className={labelClass}>Daily goal or description</Text>

          <TextInput
            value={subtitle}
            onChangeText={setSubtitle}
            placeholder="e.g. Drink 8 glasses"
            placeholderTextColor="#999EAD"
            className={inputClass}
            maxLength={100}
            returnKeyType="done"
          />

          <Text className={labelClass}>How often?</Text>

          <View className="flex-row gap-2">
            {(
              [
                { label: "Daily", value: "daily" },
                { label: "Weekdays", value: "weekdays" },
                { label: "Custom", value: "custom" },
              ] as const
            ).map((option) => {
              const selected = frequency === option.value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleFrequencyChange(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  className={`flex-1 items-center rounded-xl border px-1 py-[13px] ${
                    selected
                      ? "border-[#5965C9] bg-[#E9EBFF]"
                      : "border-[#E6E8F0] bg-white"
                  }`}
                >
                  <Text
                    className={`text-[13px] font-semibold ${
                      selected ? "text-[#5965C9]" : "text-[#73788D]"
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {frequency === "weekdays" && (
            <Text className="mt-[10px] text-xs text-[#85899B]">
              Scheduled Monday through Friday.
            </Text>
          )}

          {frequency === "daily" && (
            <Text className="mt-[10px] text-xs text-[#85899B]">
              Scheduled every day of the week.
            </Text>
          )}

          {frequency === "custom" && (
            <>
              <Text className={labelClass}>Choose your days</Text>

              <View className="flex-row justify-between gap-[5px]">
                {weekDays.map((day) => {
                  const selected = selectedDays.includes(day.value);

                  return (
                    <Pressable
                      key={day.value}
                      onPress={() => toggleDay(day.value)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                      accessibilityLabel={day.label}
                      className={`flex-1 items-center rounded-xl border py-3 ${
                        selected
                          ? "border-[#5965C9] bg-[#5965C9]"
                          : "border-[#E6E8F0] bg-white"
                      }`}
                    >
                      <Text
                        className={`text-[11px] font-semibold ${
                          selected ? "text-white" : "text-[#73788D]"
                        }`}
                      >
                        {day.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text className="mt-[10px] text-xs text-[#85899B]">
                {selectedDays.length} of 7 days selected
              </Text>
            </>
          )}

          <Pressable
            onPress={handleSave}
            className="mt-8 items-center rounded-[15px] bg-[#5965C9] p-[17px]"
          >
            <Text className="text-base font-bold text-white">
              {isEditing ? "Update Habit" : "Save Habit"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="mt-[5px] items-center p-[15px]"
          >
            <Text className="text-[15px] font-semibold text-[#73788D]">
              Cancel
            </Text>
          </Pressable>

          {isEditing && existingHabit && (
            <Pressable
              onPress={handleDelete}
              className="mt-3 items-center rounded-[15px] bg-[#FDECEC] p-4"
            >
              <Text className="text-[15px] font-bold text-[#C62828]">
                Delete Habit
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
