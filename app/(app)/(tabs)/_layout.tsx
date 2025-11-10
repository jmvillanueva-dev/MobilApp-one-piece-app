import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { AuthProvider } from "@/src/presentation/contexts/AuthContext";
import { useAuth } from "@/src/presentation/hooks/useAuth";

export default function TabsLayout() {
  return (
    <AuthProvider useAuthHook={useAuth}>
      <Tabs>
        <Tabs.Screen
          name="explore"
          options={{
            headerShown: false,
            title: "Inicio",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="list" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: "Personajes",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="users" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="id-card" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
