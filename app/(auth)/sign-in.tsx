import CustomButton from "@/components/CustomButton";
import CustomText from "@/components/CustomText";
import CustomTextInput from "@/components/CustomTextInput";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useLoginMutation } from "@/hooks/mutations/authMutations";
import { ThemeContextType } from "@/interface/type";
import { signInSchema, type SignInFormData } from "@/validation/auth.schema";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { ZodError } from "zod";
import { Images } from "../../assets/assets";

const SignIn = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { t } = useTranslation();
  const loginMutation = useLoginMutation();

  const [formData, setFormData] = useState<SignInFormData>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignInFormData, string>>>({});

  const handleChange = (key: keyof SignInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validateForm = () => {
    try {
      signInSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof SignInFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof SignInFormData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSignIn = async () => {
    if (validateForm()) {
      let data = {
        identity: formData.username,
        password: formData.password,
      };
      try {
        const res = await loginMutation.mutateAsync(data);
        if (res?.success) {
          router.replace("/(tabs)/chat");
        }
        console.log(res);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ImageBackground source={Images.loginBackground} style={styles.background}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <View style={styles.container}>
            <View style={styles.topSection} />
            <View style={styles.bottomContainer}>
              <CustomText style={styles.title}>{t("auth.signIn")}</CustomText>
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
                label={t("auth.password")}
                placeholder={t("auth.enterPassword")}
                value={formData.password}
                onChangeText={(value) => handleChange("password", value)}
                password
                error={errors.password}
              />
              <Pressable
                onPress={() => router.navigate("/(auth)/enter-email")}
                style={styles.forgotPasswordContainer}
              >
                <CustomText style={styles.forgotPasswordText}>
                  {t("auth.forgotPassword")}
                </CustomText>
              </Pressable>
              <View style={styles.spacer} />
              <CustomButton
                text={t("auth.signIn")}
                onPress={handleSignIn}
                style={styles.signInButton}
                textStyle={styles.signInButtonText}
                loading={loginMutation.isPending}
              />

              <View style={styles.orContainer}>
                <View style={styles.line} />
                <CustomText style={styles.orText}>{t("common.or")}</CustomText>
                <View style={styles.line} />
              </View>
              <GoogleSignInButton style={styles.googleButton} />
              <CustomText style={styles.loginText}>
                {t("auth.dontHaveAccount")}{" "}
                <CustomText
                  style={styles.loginLink}
                  onPress={() => router.navigate("/(auth)/sign-up")}
                >
                  {t("auth.signUp")}
                </CustomText>
              </CustomText>
            </View>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
  );
};

export default SignIn;

const getStyles = (colors: ThemeContextType["colors"]) => {
  return StyleSheet.create({
    background: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    container: {
      flex: 1,
    },
    backButton: {
      height: 40,
      width: 40,
      marginLeft: 25,
      padding: 8,
      backgroundColor: colors.surface,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 60,
    },
    topSection: {
      flex: 1,
    },
    bottomContainer: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 30,
      paddingBottom: 50,
      alignItems: "center",
      // height: 500,
    },
    title: {
      fontSize: 24,
      fontFamily: FONTS.bold,
      color: colors.text,
      marginBottom: 20,
    },
    signInButton: {
      width: "100%",
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 15,
    },
    signInButtonText: {
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
      backgroundColor: colors.border,
    },
    googleButton: {
      width: "100%",
    },
    orText: {
      marginHorizontal: 8,
      color: colors.textSecondary,
      fontFamily: FONTS.medium,
      fontSize: 14,
    },
    loginText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontFamily: FONTS.medium,
      textAlign: "center",
    },
    loginLink: {
      color: colors.primary,
      fontFamily: FONTS.bold,
    },
    forgotPasswordContainer: {
      width: "100%",
      alignItems: "flex-end",
      marginTop: 8,
    },
    forgotPasswordText: {
      color: colors.primary,
      fontFamily: FONTS.medium,
      fontSize: 14,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    spacer: {
      flex: 1,
    },
  });
};
