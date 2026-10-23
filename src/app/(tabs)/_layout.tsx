
import { Tabs } from "expo-router";
import {
  House,
  ChartNoAxesCombined,
  Info,
} from "lucide-react-native";

const COLORS = {
  primary: "#5965C9",
  inactive: "#9296A6",
  background: "#FFFFFF",
  border: "#EEF0F6",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 3,
        },
        tabBarItemStyle: {
          borderRadius: 16,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <House
              color={color}
              size={size}
              strokeWidth={focused ? 2.5 : 1.8}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarLabel: "Progress",
          tabBarIcon: ({ color, size, focused }) => (
            <ChartNoAxesCombined
              color={color}
              size={size}
              strokeWidth={focused ? 2.5 : 1.8}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarLabel: "About",
          tabBarIcon: ({ color, size, focused }) => (
            <Info
              color={color}
              size={size}
              strokeWidth={focused ? 2.5 : 1.8}
            />
          ),
        }}
      />
    </Tabs>
  );
}
