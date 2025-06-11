import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import OTPInput from "@/components/OTPInput";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useSendForgotPasswordOTPMutation, useVerifyOTPMutation } from "@/hooks/mutations/authMutations";
import { otpSchema } from "@/validation/auth.schema";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, StyleSheet, TouchableOpacity, View } from "react-native";
import { showMessage } from "react-native-flash-message";

const COUNTDOWN_DURATION = 60; // 60 seconds countdown

const VerifyOTP = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = style();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [isResending, setIsResending] = useState(false);
  const appState = useRef(AppState.currentState);
  const lastActiveTime = useRef(Date.now());
  const verifyOTPMutation = useVerifyOTPMutation();
  const sendForgotPasswordOTPMutation = useSendForgotPasswordOTPMutation();

  const params = useLocalSearchParams();

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        // App has come to the foreground
        const timeInBackground = Math.floor((Date.now() - lastActiveTime.current) / 1000);
        setCountdown((prev) => Math.max(0, prev - timeInBackground));
      } else if (nextAppState.match(/inactive|background/)) {
        // App has gone to the background
        lastActiveTime.current = Date.now();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0 && appState.current === "active") {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const validateOTP = (otp: string) => {
    try {
      otpSchema.parse({ otp });
      setError("");
      return true;
    } catch (err: any) {
      setError(t("auth.invalidOTP"));
      return false;
    }
  };

  const handleOTPChange = (otp: string) => {
    setOtp(otp);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      // Since resendOTP is not available in the service, we'll use the same endpoint as verifyOTP
      // but with a different parameter to indicate it's a resend request
      await verifyOTPMutation.mutateAsync("resend");
      setCountdown(COUNTDOWN_DURATION);
      showMessage({
        type: "success",
        message: t("auth.otpResent"),
        description: t("auth.otpResentDesc"),
      });
    } catch (error: any) {
      showMessage({
        type: "danger",
        message: t("auth.resendFailed"),
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP(otp)) {
      return;
    }

    try {
      const response = await verifyOTPMutation.mutateAsync(otp);
      if (response?.success) {
        if(params.fromScreen === "forgot-password") {
          router.push('/(auth)/sign-in');
        } else {
          router.push('/(tabs)/profile');
        }
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <CustomText style={[styles.subtitle, { color: colors.gray }]}>
          {t("auth.otpDescription")}
        </CustomText>
        <OTPInput onOTPComplete={handleOTPChange} />
        {error && (
          <CustomText style={[styles.errorText, { color: colors.red }]}>{error}</CustomText>
        )}
        <View style={styles.resendContainer}>
          <TouchableOpacity
            onPress={handleResendOTP}
            disabled={countdown > 0 || isResending}
            style={[
              styles.resendButton,
              (countdown > 0 || isResending) && styles.resendButtonDisabled,
            ]}
          >
            <CustomText
              style={[styles.resendText, { color: countdown > 0 ? colors.gray : colors.primary }]}
            >
              {countdown > 0 ? `${t("auth.resendOTP")} (${countdown}s)` : t("auth.resendOTP")}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <CustomButton
        text={t("auth.verify")}
        onPress={handleVerifyOTP}
        style={styles.button}
        textStyle={styles.buttonText}
        disabled={verifyOTPMutation.isPending || otp.length !== 6}
        loading={verifyOTPMutation.isPending}
      />
    </View>
  );
};

const style = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "space-between",
    },
    title: {
      fontSize: 24,
      fontFamily: FONTS.bold,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      fontFamily: FONTS.regular,
      marginBottom: 24,
      textAlign: "center",
      color: colors.gray,
    },
    button: {
      width: "100%",
      backgroundColor: colors.primary,
      borderRadius: 10,
      padding: 10,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: FONTS.medium,
    },
    errorText: {
      marginTop: 8,
      textAlign: "center",
      fontSize: 14,
      fontFamily: FONTS.regular,
    },
    resendContainer: {
      marginTop: 16,
      alignItems: "center",
    },
    resendButton: {
      padding: 8,
    },
    resendButtonDisabled: {
      opacity: 0.5,
    },
    resendText: {
      fontSize: 14,
      color: colors.gray,
      fontFamily: FONTS.medium,
    },
  });
};

export default VerifyOTP;
