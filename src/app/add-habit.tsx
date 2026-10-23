import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
        {
          text: "Cancel",
          style: "cancel",
        },
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

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>
          {isEditing ? "Edit Habit" : "Create a new habit"}
        </Text>
        <Text style={styles.description}>
          Start small. Stay consistent. Build a better you.
        </Text>

        <Text style={styles.label}>Choose an icon</Text>

        <View style={styles.emojiContainer}>
          {emojis.map((item) => (
            <Pressable
              key={item}
              onPress={() => setEmoji(item)}
              accessibilityRole="radio"
              accessibilityState={{ selected: emoji === item }}
              style={[
                styles.emojiOption,
                emoji === item && styles.selectedEmoji,
              ]}
            >
              <Text style={styles.emoji}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Habit name *</Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Drink more water"
          placeholderTextColor="#999EAD"
          style={styles.input}
          maxLength={60}
          returnKeyType="next"
        />

        <Text style={styles.label}>Daily goal or description</Text>

        <TextInput
          value={subtitle}
          onChangeText={setSubtitle}
          placeholder="e.g. Drink 8 glasses"
          placeholderTextColor="#999EAD"
          style={styles.input}
          maxLength={100}
          returnKeyType="done"
        />

        <Text style={styles.label}>How often?</Text>

        <View style={styles.frequencyContainer}>
          {(
            [
              { label: "Daily", value: "daily" },
              { label: "Weekdays", value: "weekdays" },
              { label: "Custom", value: "custom" },
            ] as const
          ).map((option) => (
            <Pressable
              key={option.value}
              onPress={() => handleFrequencyChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{
                selected: frequency === option.value,
              }}
              style={[
                styles.frequencyOption,
                frequency === option.value && styles.selectedFrequency,
              ]}
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequency === option.value && styles.selectedFrequencyText,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {frequency === "weekdays" && (
          <Text style={styles.scheduleHint}>
            Scheduled Monday through Friday.
          </Text>
        )}

        {frequency === "daily" && (
          <Text style={styles.scheduleHint}>
            Scheduled every day of the week.
          </Text>
        )}

        {frequency === "custom" && (
          <>
            <Text style={styles.label}>Choose your days</Text>

            <View style={styles.daysContainer}>
              {weekDays.map((day) => {
                const selected = selectedDays.includes(day.value);

                return (
                  <Pressable
                    key={day.value}
                    onPress={() => toggleDay(day.value)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={day.label}
                    style={[styles.dayButton, selected && styles.selectedDay]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        selected && styles.selectedDayText,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.scheduleHint}>
              {selectedDays.length} of 7 days selected
            </Text>
          </>
        )}

        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>
            {isEditing ? "Update Habit" : "Save Habit"}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        {isEditing && existingHabit && (
          <Pressable onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete Habit</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },
  container: {
    padding: 22,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#20243A",
    marginTop: 12,
  },
  description: {
    fontSize: 14,
    color: "#85899B",
    marginTop: 9,
    marginBottom: 15,
    lineHeight: 21,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#292D40",
    marginBottom: 12,
    marginTop: 22,
  },
  emojiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  emojiOption: {
    width: 54,
    height: 54,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedEmoji: {
    backgroundColor: "#E9EBFF",
    borderColor: "#5965C9",
    borderWidth: 2,
  },
  emoji: {
    fontSize: 25,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E8F0",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 15,
    color: "#20243A",
  },
  frequencyContainer: {
    flexDirection: "row",
    gap: 8,
  },
  frequencyOption: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  selectedFrequency: {
    backgroundColor: "#E9EBFF",
    borderColor: "#5965C9",
  },
  frequencyText: {
    color: "#73788D",
    fontWeight: "600",
    fontSize: 13,
  },
  selectedFrequencyText: {
    color: "#5965C9",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  selectedDay: {
    backgroundColor: "#5965C9",
    borderColor: "#5965C9",
  },
  dayText: {
    color: "#73788D",
    fontSize: 11,
    fontWeight: "600",
  },
  selectedDayText: {
    color: "#FFFFFF",
  },
  scheduleHint: {
    marginTop: 10,
    fontSize: 12,
    color: "#85899B",
  },
  saveButton: {
    backgroundColor: "#5965C9",
    padding: 17,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 32,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    padding: 15,
    alignItems: "center",
    marginTop: 5,
  },
  cancelButtonText: {
    color: "#73788D",
    fontSize: 15,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#FDECEC",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 12,
  },
  deleteButtonText: {
    color: "#C62828",
    fontSize: 15,
    fontWeight: "700",
  },
});