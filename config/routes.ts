import { Route } from "expo-router";

export const ROUTE = {
  index: "/",

  //Auth routes
  "auth.signIn": "/(auth)/sign-in",
  "auth.signUp": "/(auth)/sign-up",
  "auth.verifyOtp": "/(auth)/verify-otp",
  "auth.enterEmail": "/(auth)/enter-email",
  "auth.forgotPassword": "/(auth)/forgot-password",

  //tabs
  "tabs.chat": "/(tabs)/chat",
  "tabs.profile": "/(tabs)/profile",
  "tabs.call": "/(tabs)/call",

  //profile
  "profile.editProfile": "/profile/edit-profile",
  "profile.changePassword": "/profile/change-password",
} as const satisfies Record<string, Route>;
