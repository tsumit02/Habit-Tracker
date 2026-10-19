import { useState } from "react";
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
import { router } from "expo-router";
import { useHabits } from "../context/HabitContext";

const emojis = ["💧", "📚", "🏃", "🧘", "💪", "🥗", "😴", "✍️"];

export default function AddHabitScreen() {
  const { addHabit } = useHabits();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [emoji, setEmoji] = useState("⭐");

  const handleSave = () => {
    const habitTitle = title.trim();

    if (!habitTitle) {
      Alert.alert("Habit name required", "Please enter a habit name.");
      return;
    }

    addHabit(
      habitTitle,
      subtitle.trim() || "Daily goal",
      emoji
    );

    router.back();
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
        <Text style={styles.heading}>Create a new habit</Text>
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

        <Pressable
          onPress={handleSave}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Save Habit</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
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
    marginBottom: 30,
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
});