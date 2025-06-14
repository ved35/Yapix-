import { Route } from "expo-router";

export const ROUTE = {
    index: "/",

    //Auth routes
    "auth.signIn": "/(auth)/sign-in",
    "auth.signUp": "/(auth)/sign-up",
    "auth.verifyOtp": "/(auth)/verify-otp",
    "auth.enterEmail": "/(auth)/enter-email",
    "auth.forgotPassword": "/(auth)/forgot-password",

    //chat
    "tabs.chat": "/(tabs)/chat",
    "tabs.profile": "/(tabs)/profile"

} as const satisfies Record<string, Route>;