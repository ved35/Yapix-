import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { CustomButtonProps, ThemeContextType } from "@/interface/type";
import React, { memo } from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import CustomText from "./CustomText";

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  variant = "filled",
  style,
  textStyle,
  disabled = false,
  loading = false,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const buttonStyles = [
    styles.button,
    variant === "filled" ? styles.filledButton : styles.outlinedButton,
    variant === "filled" ? { backgroundColor: colors.primary } : { borderColor: colors.primary },
    disabled && { opacity: 0.5 },
    style,
  ];

  const textStyles = [
    styles.text,
    variant === "filled" ? styles.filledText : styles.outlinedText,
    variant === "filled" ? { color: colors.white } : { color: colors.primary },
    textStyle,
  ];

  return (
    <Pressable style={buttonStyles} onPress={onPress} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator
          color={variant === "filled" ? colors.white : colors.primary}
          size="small"
        />
      ) : (
        <CustomText style={textStyles}>{text}</CustomText>
      )}
    </Pressable>
  );
};

const getStyles = (colors: ThemeContextType["colors"]) => {
  return StyleSheet.create({
    button: {
      borderRadius: 10,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    filledButton: {
      borderWidth: 0,
    },
    outlinedButton: {
      borderWidth: 1.5,
      backgroundColor: "transparent",
    },
    text: {
      fontSize: 17,
      fontFamily: FONTS.medium,
    },
    filledText: {},
    outlinedText: {},
  });
};

export default memo(CustomButton);
