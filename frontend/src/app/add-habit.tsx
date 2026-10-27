import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Sparkles,
  Trash2,
} from "lucide-react-native";

import { AppButton, AppCard, AppInput } from "../components/ui";
import { colors, spacing } from "../theme";
import { useHabits, HabitFrequency } from "../context/HabitContext";
import styles from "../styles/add-habit.styles";
import { ApiError } from "../services/api";

const emojis = ["⭐", "💧", "📚", "🏃", "🧘", "💪", "🥗", "😴", "✍️", "🎯", "🧠", "🚶"];

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

const frequencyOptions: {
  label: string;
  value: HabitFrequency;
  description: string;
}[] = [
  {
    label: "Daily",
    value: "daily",
    description: "Build consistency every day",
  },
  {
    label: "Weekdays",
    value: "weekdays",
    description: "Monday through Friday",
  },
  {
    label: "Custom",
    value: "custom",
    description: "Choose your own days",
  },
];

export default function AddHabitScreen() {
  const insets = useSafeAreaInsets();

  const { habits, addHabit, updateHabit, deleteHabit } = useHabits();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
  const [selectedDays, setSelectedDays] = useState<number[]>(allDayValues);

  useEffect(() => {
    if (!existingHabit) return;

    setTitle(existingHabit.title);
    setSubtitle(existingHabit.subtitle);
    setEmoji(existingHabit.emoji);
    setFrequency(existingHabit.frequency);
    setSelectedDays(existingHabit.scheduledDays);
  }, [existingHabit]);

  const handleFrequencyChange = (newFrequency: HabitFrequency) => {
    setFrequency(newFrequency);

    if (newFrequency === "daily") {
      setSelectedDays(allDayValues);
    } else if (newFrequency === "weekdays") {
      setSelectedDays(weekdayValues);
    }
  };

  const toggleDay = (day: number) => {
    setSelectedDays((previous) =>
      previous.includes(day)
        ? previous.filter((value) => value !== day)
        : [...previous, day].sort((a, b) => a - b)
    );
  };

const handleSave = async () => {
  if (isSaving) return;

  const habitTitle = title.trim();

  if (!habitTitle) {
    Alert.alert(
      "Habit name required",
      "Please enter a name for your habit."
    );
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

  setIsSaving(true);

  try {
    if (isEditing && existingHabit) {
      await updateHabit(
        existingHabit.id,
        habitTitle,
        subtitle.trim(),
        emoji,
        frequency,
        scheduledDays
      );
    } else {
      await addHabit(
        habitTitle,
        subtitle.trim(),
        emoji,
        frequency,
        scheduledDays
      );
    }

    // Return only after the backend operation succeeds.
    router.back();
  } catch (error) {
    console.error("[AddHabit] Save failed:", error);

    const message =
      error instanceof ApiError
        ? error.message
        : "We couldn't save your habit. Please try again.";

    Alert.alert(
      isEditing ? "Couldn't update habit" : "Couldn't save habit",
      message
    );
  } finally {
    setIsSaving(false);
  }
};

  const handleDelete = () => {
    if (!existingHabit || isDeleting) return;

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
          onPress: async () => {
            setIsDeleting(true);

            try {
              await deleteHabit(existingHabit.id);
              router.back();
            } catch (error) {
              console.error("[AddHabit] Delete failed:", error);

              Alert.alert(
                "Couldn't delete habit",
                error instanceof ApiError
                  ? error.message
                  : "We couldn't delete this habit. Please try again."
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const scheduleDescription =
    frequency === "daily"
      ? "Scheduled every day of the week."
      : frequency === "weekdays"
        ? "Scheduled Monday through Friday."
        : `${selectedDays.length} of 7 days selected.`;

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: Math.max(insets.top, spacing.md),
              paddingBottom: Math.max(insets.bottom, spacing.xxl),
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={21} color={colors.text} />
            </Pressable>

            <View style={styles.headerText}>
              <Text style={styles.screenTitle}>
                {isEditing ? "Edit Habit" : "Create a habit"}
              </Text>
              <Text style={styles.screenSubtitle}>
                Small steps lead to meaningful change.
              </Text>
            </View>
          </View>

          {/* Habit details */}
          <AppCard style={styles.sectionCard}>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionIcon}>
                <Sparkles size={20} color={colors.primary} />
              </View>

              <View>
                <Text style={styles.sectionTitle}>Habit details</Text>
                <Text style={styles.sectionDescription}>
                  Give your new habit a name and an icon.
                </Text>
              </View>
            </View>

            <Text style={styles.fieldLabel}>Choose an icon</Text>

            <View style={styles.emojiGrid}>
              {emojis.map((item) => {
                const selected = emoji === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setEmoji(item)}
                    style={[
                      styles.emojiOption,
                      selected && styles.emojiOptionSelected,
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`Choose ${item} icon`}
                  >
                    <Text style={styles.emojiText}>{item}</Text>

                    {selected && (
                      <View style={styles.selectedCheck}>
                        <Check size={12} color={colors.surface} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.fieldGroup}>
              <AppInput
                label="Habit name"
                placeholder="e.g. Read for 20 minutes"
                value={title}
                onChangeText={setTitle}
                maxLength={60}
                returnKeyType="next"
                accessibilityLabel="Habit name"
              />
            </View>

            <AppInput
              label="Description (optional)"
              placeholder="e.g. Read before going to bed"
              value={subtitle}
              onChangeText={setSubtitle}
              maxLength={120}
              returnKeyType="done"
              accessibilityLabel="Habit description"
            />
          </AppCard>

          {/* Schedule */}
          <AppCard style={styles.sectionCard}>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionIcon}>
                <CalendarDays size={20} color={colors.primary} />
              </View>

              <View>
                <Text style={styles.sectionTitle}>Your schedule</Text>
                <Text style={styles.sectionDescription}>
                  Decide how often you want to do this habit.
                </Text>
              </View>
            </View>

            <View style={styles.frequencyList}>
              {frequencyOptions.map((option) => {
                const selected = frequency === option.value;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleFrequencyChange(option.value)}
                    style={[
                      styles.frequencyOption,
                      selected && styles.frequencyOptionSelected,
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                  >
                    <View
                      style={[
                        styles.frequencyRadio,
                        selected && styles.frequencyRadioSelected,
                      ]}
                    >
                      {selected && <View style={styles.frequencyRadioDot} />}
                    </View>

                    <View style={styles.frequencyText}>
                      <Text style={styles.frequencyLabel}>
                        {option.label}
                      </Text>
                      <Text style={styles.frequencyDescription}>
                        {option.description}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {frequency === "custom" && (
              <>
                <Text style={[styles.fieldLabel, styles.customDaysLabel]}>
                  Choose your days
                </Text>

                <View style={styles.dayList}>
                  {weekDays.map((day) => {
                    const selected = selectedDays.includes(day.value);

                    return (
                      <Pressable
                        key={day.value}
                        onPress={() => toggleDay(day.value)}
                        style={[
                          styles.dayOption,
                          selected && styles.dayOptionSelected,
                        ]}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: selected }}
                        accessibilityLabel={day.label}
                      >
                        <Text
                          style={[
                            styles.dayLabel,
                            selected && styles.dayLabelSelected,
                          ]}
                        >
                          {day.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            <Text style={styles.helperText}>{scheduleDescription}</Text>
          </AppCard>

          {/* Preview */}
          <AppCard style={styles.previewCard}>
            <Text style={styles.previewLabel}>HABIT PREVIEW</Text>

            <View style={styles.previewRow}>
              <View style={styles.previewEmoji}>
                <Text style={styles.previewEmojiText}>{emoji}</Text>
              </View>

              <View style={styles.frequencyText}>
                <Text style={styles.previewTitle}>
                  {title.trim() || "Your new habit"}
                </Text>
                <Text style={styles.previewSubtitle}>
                  {subtitle.trim() || scheduleDescription}
                </Text>
              </View>
            </View>
          </AppCard>

          {/* Actions */}
         <AppButton
            title={
              isSaving
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                  ? "Update Habit"
                  : "Save Habit"
            }
            onPress={handleSave}
            disabled={isSaving}
            icon={<Check size={19} color={colors.surface} />}
            style={styles.saveButton}
          />

          <Pressable
            onPress={() => router.back()}
            style={styles.cancelButton}
            accessibilityRole="button"
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          {isEditing && existingHabit && (
            <Pressable
              onPress={handleDelete}
              disabled={isDeleting}
              style={styles.deleteButton}
              accessibilityRole="button"
            >
              {isDeleting ? (
                <Text style={styles.deleteText}>Deleting...</Text>
              ) : (
                <>
                  <Trash2 size={17} color={colors.danger} />
                  <Text style={styles.deleteText}>Delete Habit</Text>
                </>
              )}
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}