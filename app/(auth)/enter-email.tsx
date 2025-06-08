import CustomButton from "@/components/CustomButton";
import CustomTextInput from "@/components/CustomTextInput";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { SignUpFormData } from "@/validation/auth.schema";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const EnterEmail = () => {
  const styles = style();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
  return (
    <View style={styles.container}>
      <CustomTextInput
        label={t("auth.email")}
        placeholder={t("auth.enterEmail")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={errors.email}
      />
      <View style={{ flex: 1 }} />
      <CustomButton
        text={t("auth.sendotp")}
        onPress={() => {
          router.navigate("/(auth)/verify-otp");
        }}
        style={styles.button}
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
