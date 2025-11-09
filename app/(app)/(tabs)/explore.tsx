import { useAuthContext } from "@/src/presentation/contexts/AuthContext";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function PlanetsScreen() {
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.replace("/(auth)/login");
    }
  };

  return (
    <>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Hola</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text>Salir</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}