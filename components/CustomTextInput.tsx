import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { CustomTextInputProps, ThemeContextType } from "@/interface/type";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import CustomText from "./CustomText";

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  containerStyle,
  style,
  password = false,
  secureTextEntry,
  error,
  ...props
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <CustomText style={styles.label} allowFontScaling={false}>
          {label}
        </CustomText>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, error && styles.inputError, style]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={password && !showPassword}
          allowFontScaling={false}
          {...props}
        />
        {password && (
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <CustomText style={styles.errorText} allowFontScaling={false}>
          {error}
        </CustomText>
      )}
    </View>
  );
};

const getStyles = (colors: ThemeContextType["colors"]) =>
  StyleSheet.create({
    container: {
      width: "100%",
      marginBottom: 0,
    },
    label: {
      fontSize: 14,
      color: colors.text,
      fontFamily: FONTS.medium,
      marginBottom: 4,
      marginTop: 12,
    },
    inputWrapper: {
      position: "relative",
      flexDirection: "row",
      alignItems: "center",
    },
    input: {
      width: "100%",
      height: 50,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      backgroundColor: colors.surface,
      color: colors.text,
      fontSize: 14,
      fontFamily: FONTS.regular,
    },
    inputError: {
      borderColor: colors.error,
    },
    eyeIcon: {
      position: "absolute",
      right: 12,
      top: 15,
    },
    errorText: {
      color: colors.error,
      fontSize: 12,
      fontFamily: FONTS.regular,
      marginTop: 4,
    },
  });

export default CustomTextInput;
