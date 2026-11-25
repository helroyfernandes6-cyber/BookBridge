
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const C = {
  blue: "#2857A9",
  muted: "#8993A1",
  white: "#FFFFFF",
  border: "#E5E1D8"
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.blue,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: {
          backgroundColor: C.white,
          borderTopColor: C.border,
          height: 65,
          paddingTop: 7,
          paddingBottom: 7
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="home" colour={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="search" colour={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="add-book"
        options={{
          title: "Add Book",
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="add-circle" colour={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: "Requests",
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="mail" colour={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="person" colour={color} size={size} />
        }}
      />
    </Tabs>
  );
}
