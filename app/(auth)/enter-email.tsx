import CustomButton from "@/components/CustomButton";
import CustomTextInput from "@/components/CustomTextInput";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useSendForgotPasswordOTPMutation } from "@/hooks/mutations/authMutations";
import { SignUpFormData } from "@/validation/auth.schema";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { z } from "zod";

const emailSchema = z.string().email("Invalid email address").min(1, "Email is required");

const EnterEmail = () => {
  const styles = style();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
  const sendForgotPasswordOTPMutation = useSendForgotPasswordOTPMutation();

  const validateEmail = (value: string) => {
    try {
      emailSchema.parse(value);
      setErrors((prev) => ({ ...prev, email: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, email: error.errors[0].message }));
      }
      return false;
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    validateEmail(value);
  };

  const onPress = async () => {
    if (validateEmail(email)) {
      try {
        const res = await sendForgotPasswordOTPMutation.mutateAsync(email);
        if (res?.success) {
          router.replace({
            pathname: "/(auth)/verify-otp",
            params: { fromScreen: "forgot-password" },
          });
        }
      } catch (error) {
        console.log("error` emai", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CustomTextInput
        label={t("auth.email")}
        placeholder={t("auth.enterEmail")}
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.email}
      />
      <View style={{ flex: 1 }} />
      <CustomButton
        text={t("auth.sendotp")}
        onPress={onPress}
        style={styles.button}
        loading={sendForgotPasswordOTPMutation.isPending}
        textStyle={styles.buttonText}
      />
    </View>
  );
};

export default EnterEmail;

const style = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "space-between",
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
  });
};
