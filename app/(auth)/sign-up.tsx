import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useSignupMutation } from "@/hooks/mutations/authMutations";
import { signUpSchema, type SignUpFormData } from "@/validation/auth.schema";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { ZodError } from "zod";

const SignUp = () => {
  const styles = style();
  const { t } = useTranslation();
  const signupMutation = useSignupMutation();

  // Single state for all form fields
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});

  const handleChange = (key: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validateForm = () => {
    try {
      signUpSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof SignUpFormData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSignUp = async () => {
    if (validateForm()) {
      let data = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        name: formData.name,
        provider: "email",
      };
      try {
        const res = await signupMutation.mutateAsync(data);
        console.log("res-->", JSON.stringify(res));
        if (res?.success) {
          router.navigate({ pathname: "/(auth)/verify-otp", params: { email: formData.email } });
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 110}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="chat-bubble" size={48} style={styles.icon} />
        </View>
        <CustomText style={styles.title}>{t("auth.createAccount")}</CustomText>
        <CustomText style={styles.subtitle}>{t("auth.joinUs")}</CustomText>
        <View style={styles.inputContainer}>
          <CustomTextInput
            label={t("auth.username")}
            placeholder={t("auth.enterUsername")}
            value={formData.username}
            onChangeText={(value) => handleChange("username", value)}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.username}
          />
          <CustomTextInput
            label={t("auth.name")}
            placeholder={t("auth.enterName")}
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
            error={errors.name}
          />
          <CustomTextInput
            label={t("auth.email")}
            placeholder={t("auth.enterEmail")}
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
          />
          <CustomTextInput
            label={t("auth.password")}
            placeholder={t("auth.enterPassword")}
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
        <CustomButton
          text={t("auth.signUp")}
          onPress={handleSignUp}
          style={styles.signUpButton}
          textStyle={styles.signUpButtonText}
          loading={signupMutation.isPending}
        />
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <CustomText style={styles.orText}>{t("common.or")}</CustomText>
          <View style={styles.line} />
        </View>
        <GoogleSignInButton style={styles.googleButton} />
        <CustomText style={styles.loginText}>
          {t("auth.alreadyHaveAccount")}{" "}
          <CustomText style={styles.loginLink} onPress={() => router.push("/sign-in")}>
            {t("auth.logIn")}
          </CustomText>
        </CustomText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

const style = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.white,
      paddingVertical: 32,
      paddingHorizontal: 20,
    },
    iconContainer: {
      marginBottom: 16,
      alignItems: "center",
    },
    icon: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 16,
      color: colors.white,
    },
    title: {
      fontSize: 24,
      fontFamily: FONTS.bold,
      textAlign: "center",
      marginBottom: 4,
      color: colors.black,
    },
    subtitle: {
      fontSize: 14,
      color: colors.gray,
      fontFamily: FONTS.medium,
      textAlign: "center",
      marginBottom: 24,
    },
    inputContainer: {
      width: "100%",
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: colors.black,
      fontFamily: FONTS.medium,
      marginBottom: 4,
      marginTop: 12,
    },
    input: {
      width: "100%",
      height: 50,
      borderColor: colors.lightGray,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      backgroundColor: colors.white,
      marginBottom: 0,
      color: colors.black,
      fontSize: 14,
      fontFamily: FONTS.regular,
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
    },
    eyeIcon: {
      position: "absolute",
      right: 12,
      top: 12,
    },
    signUpButton: {
      width: "100%",
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 16,
    },
    signUpButtonText: {
      color: colors.white,
      fontSize: 16,
      fontFamily: FONTS.bold,
    },
    orContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 16,
      width: "100%",
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.lightGray,
    },
    googleButton: {
      width: "100%",
    },
    orText: {
      marginHorizontal: 8,
      color: colors.gray,
      fontFamily: FONTS.medium,
      fontSize: 14,
    },
    loginText: {
      color: colors.gray,
      fontSize: 14,
      fontFamily: FONTS.medium,
      textAlign: "center",
    },
    loginLink: {
      color: colors.primary,
      fontFamily: FONTS.bold,
    },
  });
};
