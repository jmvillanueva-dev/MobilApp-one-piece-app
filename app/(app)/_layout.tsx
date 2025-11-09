import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { container } from "@/src/di/container";
import { useAuth } from "@/src/presentation/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // 🟢 Inicializar el container
  const [containerReady, setContainerReady] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const initContainer = async () => {
      try {
        await container.initialize();
        setContainerReady(true);
      } catch (error) {
        console.error("Error initializing container:", error);
      }
    };

    initContainer();
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      router.replace("/(app)/(tabs)/explore");
    } else {
      router.replace("/(auth)/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (containerReady && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [containerReady, authLoading]);

  if (!containerReady || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </ThemeProvider>
  );
}
