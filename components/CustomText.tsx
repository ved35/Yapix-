import { useTheme } from "@/context/ThemeContext";
import { ThemeContextType } from "@/interface/type";
import React, { memo } from "react";
import { StyleSheet, Text, TextProps } from "react-native";

const CustomText: React.FC<TextProps> = ({ ...props }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <Text allowFontScaling={false} style={[styles.text, props.style]} {...props}>
      {props.children}
    </Text>
  );
};

const getStyles = (colors: ThemeContextType["colors"]) =>
  StyleSheet.create({
    text: {
      color: colors.text,
      verticalAlign: "middle",
      includeFontPadding: false,
      textAlignVertical: "center",
    },
  });

export default memo(CustomText);
