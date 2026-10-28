import { Tabs } from "expo-router";
import {
  House,
  ChartNoAxesCombined,
  Info,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../theme/ThemeProvider";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: Math.max(insets.bottom > 0 ? 6 : 12, 6),
          height: 62 + Math.max(insets.bottom - 4, 0),
          paddingTop: 7,
          paddingBottom: Math.max(
            insets.bottom > 0 ? insets.bottom - 2 : 8,
            8,
          ),
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          borderRadius: 22,
          elevation: 8,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
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
