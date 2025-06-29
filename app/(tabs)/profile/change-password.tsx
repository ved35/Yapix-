import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import CustomTextInput from "@/components/CustomTextInput";
import { useTheme } from "@/context/ThemeContext";
import { useChangePasswordMutation } from "@/hooks/mutations/profileMutation";
import { ChangePasswordFormData } from "@/interface/type";
import { changePasswordSchema } from "@/validation/auth.schema";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ZodError } from "zod";

const ChangePassword = () => {
  const styles = style();
  const { t } = useTranslation();
  const changePasswordMutation = useChangePasswordMutation();

  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordFormData, string>>>({});

  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (key: keyof ChangePasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const validateForm = () => {
    try {
      changePasswordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof ChangePasswordFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ChangePasswordFormData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSave = async () => {
    if (validateForm()) {
      let data = {
        newPassword: formData.password,
        currentPassword: formData.currentPassword,
      };
      const res = await changePasswordMutation.mutateAsync(data);
      if (res?.success) {
        router.canGoBack() && router.back();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <CustomHeader title={t("profile.changePassword")} />
        <View style={{ flex: 1, marginTop: 30 }}>
          <CustomTextInput
            label={t("profile.currentPassword")}
            value={formData.currentPassword}
            onChangeText={(value) => handleChange("currentPassword", value)}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            error={errors.currentPassword}
            containerStyle={styles.input}
            placeholder={t("profile.enterCurrentPassword")}
          />
          <CustomTextInput
            label={t("profile.newPassword")}
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            error={errors.password}
            containerStyle={styles.input}
            placeholder={t("profile.enterNewPassword")}
          />
          <CustomTextInput
            label={t("profile.confirmNewPassword")}
            value={formData.confirmPassword}
            onChangeText={(value) => handleChange("confirmPassword", value)}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            error={errors.confirmPassword}
            containerStyle={styles.input}
            placeholder={t("profile.enterConfirmNewPassword")}
          />
        </View>
        <CustomButton
          text={t("profile.changePassword")}
          style={styles.saveButton}
          onPress={handleSave}
          loading={changePasswordMutation.isPending}
        />
      </View>
    </View>
  );
};

export default ChangePassword;

const style = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.background,
    },
    contentContainer: {
      width: "90%",
      flex: 1,
      alignItems: "center",
    },
    input: {
      marginBottom: 5,
    },
    saveButton: {
      marginTop: "auto",
      width: "100%",
      marginBottom: 50,
    },
  });
};
