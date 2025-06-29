import { FONTS } from "@/constants/theme";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { queryClient } from "@/hooks/useQuery";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../config/i18n";
// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: "17253970169-ls73vqa88vvtbssr8n0peljgqtr1akpo.apps.googleusercontent.com",
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Font-Regular": require("../assets/fonts/Font-Regular.ttf"),
    "Font-Medium": require("../assets/fonts/Font-Medium.ttf"),
    "Font-Light": require("../assets/fonts/Font-Light.ttf"),
    "Font-SemiBold": require("../assets/fonts/Font-SemiBold.ttf"),
    "Font-Bold": require("../assets/fonts/Font-Bold.ttf"),
    "Font-ExtraBold": require("../assets/fonts/Font-ExtraBold.ttf"),
    "Font-Black": require("../assets/fonts/Font-Black.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
              <Slot />
              <FlashMessage
                position="top"
                duration={2500}
                titleStyle={styles.flashTextStyle}
                textStyle={[styles.flashTextStyle, { fontSize: 14 }]}
                statusBarHeight={(StatusBar.currentHeight || 25) - 5}
              />
            </View>
          </GestureHandlerRootView>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  flashTextStyle: {
    fontSize: 17,
    fontFamily: FONTS.semiBold,
  },
});
