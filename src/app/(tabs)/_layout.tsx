import { Tabs } from "expo-router";
import { ColorValue, Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#5965C9",
        tabBarInactiveTintColor: "#9296A6",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#EEF0F6",
          height: 62,
          paddingTop: 7,
          paddingBottom: 7,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <TextIcon emoji="🏠" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarLabel: "Progress",
          tabBarIcon: ({ color, size }) => (
            <TextIcon emoji="📈" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarLabel: "About",
          tabBarIcon: ({ color, size }) => (
            <TextIcon emoji="ℹ️" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

function TextIcon({
  emoji,
  color,
  size,
}: {
  emoji: string;
  color: ColorValue;
  size: number;
}) {
  return (
    <Text
      style={{
        fontSize: size,
        color,
      }}
    >
      {emoji}
    </Text>
  );
}