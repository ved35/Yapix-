import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useResetPasswordMutation } from "@/hooks/mutations/authMutations";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/validation/auth.schema";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { ZodError } from "zod";

const ForgotPassword = () => {
  const styles = style();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const resetPasswordMutation = useResetPasswordMutation();

  const params = useLocalSearchParams();

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordFormData, string>>>({});

  const handleChange = (key: keyof ResetPasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validateForm = () => {
    try {
      resetPasswordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ResetPasswordFormData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleResetPassword = async () => {
    if (validateForm()) {
      try {
        const res = await resetPasswordMutation.mutateAsync({
          newPassword: String(formData.password),
          email: params.email as string,
        });
        if (res?.success) {
          router.push("/(auth)/sign-in");
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 110}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <CustomText style={styles.subtitle}>{t("auth.resetPasswordDesc")}</CustomText>

          <View style={styles.inputContainer}>
            <CustomTextInput
              label={t("auth.newPassword")}
              placeholder={t("auth.enterNewPassword")}
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
              password
              error={errors.password}
            />
            <CustomTextInput
              label={t("auth.confirmPassword")}
              placeholder={t("auth.confirmPasswordPlaceholder")}
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange("confirmPassword", value)}
              password
              error={errors.confirmPassword}
            />
          </View>
          <View style={styles.spacer} />

          <CustomButton
            text={t("auth.resetPassword")}
            onPress={handleResetPassword}
            style={styles.button}
            textStyle={styles.buttonText}
            loading={resetPasswordMutation.isPending}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const style = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontFamily: FONTS.bold,
      textAlign: "center",
      marginBottom: 8,
      color: colors.black,
    },
    subtitle: {
      fontSize: 14,
      color: colors.gray,
      fontFamily: FONTS.medium,
      textAlign: "center",
      marginBottom: 32,
    },
    inputContainer: {
      width: "100%",
      marginBottom: 24,
    },
    button: {
      width: "100%",
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
    },
    buttonText: {
      color: colors.white,
      fontSize: 16,
      fontFamily: FONTS.bold,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    spacer: {
      flex: 1,
    },
  });
};
