import { Stack } from "expo-router";

import { HabitProvider } from "../context/HabitContext";

export default function RootLayout() {
  return (
    <HabitProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </HabitProvider>
  );
}
