/**
 * QuestBound — Root Layout (Expo Router)
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Install dependencies:
 *    npx expo install expo-router expo-linking expo-constants
 *    npx expo install react-native-screens react-native-safe-area-context
 *    npx expo install expo-linear-gradient
 *    npx expo install @expo-google-fonts/cinzel @expo-google-fonts/nunito expo-font
 *
 * 2. Make sure your package.json has: "main": "expo-router/entry"
 *
 * 3. Add to app.json:
 *    "scheme": "questbound",
 *    "web": { "bundler": "metro" }
 */

import { useEffect } from "react";
import { StatusBar } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Cinzel_400Regular,
  Cinzel_600SemiBold,
  Cinzel_700Bold,
  Cinzel_900Black,
} from "@expo-google-fonts/cinzel";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";

import { Colors } from "../constants/theme";

// Prevent the splash screen from auto-hiding before fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
    Cinzel_700Bold,
    Cinzel_900Black,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgDark} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bgDark },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
      </Stack>
    </SafeAreaProvider>
  );
}
