import CustomText from "@/components/CustomText";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export default function AuthLayout() {
  const styles = style();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
        presentation: "card",
        gestureEnabled: true,
        gestureDirection: "horizontal",
        contentStyle: styles.content,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={22} color="#000" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="sign-up"
        options={{
          title: "Create an account",
          headerTitle: () => (
            <CustomText style={styles.headerTitle} numberOfLines={1}>
              Create an account
            </CustomText>
          ),
        }}
      />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: "Forgot Password",
          headerTitle: () => (
            <CustomText style={styles.headerTitle} numberOfLines={1}>
              Forgot Password
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="enter-email"
        options={{
          title: "Enter Email",
          headerTitle: () => (
            <CustomText style={styles.headerTitle} numberOfLines={1}>
              Enter Email
            </CustomText>
          ),
        }}
      />
      <Stack.Screen
        name="verify-otp"
        options={{
          title: "Verify OTP",
          headerTitle: () => (
            <CustomText style={styles.headerTitle} numberOfLines={1}>
              Verify OTP
            </CustomText>
          ),
        }}
      />
    </Stack>
  );
}

const style = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      backgroundColor: colors.white,
    },
    header: {
      backgroundColor: colors.white,
      height: 60,
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: FONTS.bold,
      color: colors.black,
    },
    backButton: {
      height: 40,
      width: 40,
      marginLeft: 10,
      padding: 8,
      backgroundColor: colors.lightGray,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
