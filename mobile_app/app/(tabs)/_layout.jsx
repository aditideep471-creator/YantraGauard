import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // Active tab color
        tabBarActiveTintColor: "#7b68ee",

        // Inactive tab color
        tabBarInactiveTintColor: "#bbb",

        // Bottom bar styling
        tabBarStyle: {
          backgroundColor: "#3b2fa3",
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopWidth: 0
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600"
        }
      }}
    >
      {/* ================= DASHBOARD ================= */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />

      {/* ================= INCIDENTS ================= */}
      <Tabs.Screen
        name="incidents"
        options={{
          title: "Incidents",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          )
        }}
      />

      {/* ================= REPORT ================= */}
      <Tabs.Screen
        name="report"
        options={{
          title: "Report",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" size={size} color={color} />
          )
        }}
      />

      {/* ================= PROFILE ================= */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          )
        }}
      />

      {/*=============================== MY REPORTS ==================================== */}

      <Tabs.Screen
        name="myreports"
        options={{
          title: "My Reports",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          )
        }}
      />

    </Tabs>


  );
}