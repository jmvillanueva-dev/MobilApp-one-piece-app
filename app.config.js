export default ({ config }) => {
  const baseExpoConfig = {
    ...config,
    name: "one-piece-app",
    slug: "one-piece-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "onepieceapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "4cce62dd-26f6-4ebb-9e96-42e780933f5c",
      },
      EXPO_PUBLIC_API_KEY: process.env.EXPO_PUBLIC_API_KEY,
      EXPO_PUBLIC_AUTH_DOMAIN: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
      EXPO_PUBLIC_PROJECT_ID: process.env.EXPO_PUBLIC_PROJECT_ID,
      EXPO_PUBLIC_STORAGE_BUCKET: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
      EXPO_PUBLIC_MESSAGING_SENDER_ID:
        process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_APP_ID: process.env.EXPO_PUBLIC_APP_ID,
    },
  };

  // Configuraciones específicas de plataforma
  return {
    ...baseExpoConfig,
    ios: {
      ...baseExpoConfig.ios,
      supportsTablet: true,
    },
    android: {
      ...baseExpoConfig.android,
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      // 🔑 ¡Asegúrate de definir aquí tu "package" de Android si no lo está!
      // package: "com.tunombredeusuario.onepieceapp"
    },
    web: {
      ...baseExpoConfig.web,
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
  };
};
