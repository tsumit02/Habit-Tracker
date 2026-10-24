import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

const COLORS = {
  background: "#F5F5FF",
  ink: "#202044",
  muted: "#8589A8",
  purple: "#6258F5",
  border: "#E9E9F7",
};

export default function LoginScreen() {
  const { login, register } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Enter your email and password.");
      return;
    }

    if (isRegistering && !name.trim()) {
      Alert.alert("Name required", "Enter your name to create an account.");
      return;
    }

    if (isRegistering && password.length < 8) {
      Alert.alert(
        "Password too short",
        "Use a password with at least 8 characters."
      );
      return;
    }

    try {
      setBusy(true);

      if (isRegistering) {
        await register(name.trim(), email.trim(), password);
      } else {
        console.log(name);
        await login(email.trim(), password);
      }

      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        isRegistering ? "Registration failed" : "Login failed",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View
              style={{
                width: 76,
                height: 76,
                borderRadius: 26,
                backgroundColor: "#E6E6FF",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "900",
                  color: COLORS.purple,
                }}
              >
                H
              </Text>
            </View>

            <Text
              style={{
                fontSize: 30,
                fontWeight: "900",
                color: COLORS.ink,
              }}
            >
              Habit Tracker
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: COLORS.muted,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Small steps. Better habits. A better you.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#FFFFFF",
              padding: 22,
              borderRadius: 26,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "800",
                color: COLORS.ink,
                marginBottom: 6,
              }}
            >
              {isRegistering ? "Create account" : "Welcome back"}
            </Text>

            <Text style={{ color: COLORS.muted, marginBottom: 24 }}>
              {isRegistering
                ? "Start building habits that last."
                : "Sign in to continue your journey."}
            </Text>

            {isRegistering && (
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                placeholderTextColor={COLORS.muted}
                autoCapitalize="words"
                editable={!busy}
                style={inputStyle}
              />
            )}

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor={COLORS.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!busy}
              style={inputStyle}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password (minimum 8 characters)"
              placeholderTextColor={COLORS.muted}
              secureTextEntry
              autoCapitalize="none"
              editable={!busy}
              onSubmitEditing={() => void handleSubmit()}
              style={[inputStyle, { marginBottom: 20 }]}
            />

            <Pressable
              onPress={() => void handleSubmit()}
              disabled={busy}
              style={{
                backgroundColor: COLORS.purple,
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: "center",
                opacity: busy ? 0.7 : 1,
              }}
            >
              {busy ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontWeight: "800",
                  }}
                >
                  {isRegistering ? "Create account" : "Sign in"}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => setIsRegistering((value) => !value)}
              disabled={busy}
              style={{ marginTop: 22, alignItems: "center" }}
            >
              <Text style={{ color: COLORS.muted, fontSize: 14 }}>
                {isRegistering
                  ? "Already have an account? "
                  : "New here? "}
                <Text style={{ color: COLORS.purple, fontWeight: "800" }}>
                  {isRegistering ? "Sign in" : "Create account"}
                </Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: COLORS.border,
  backgroundColor: COLORS.background,
  borderRadius: 14,
  paddingHorizontal: 15,
  paddingVertical: 14,
  fontSize: 15,
  color: COLORS.ink,
  marginBottom: 14,
};
