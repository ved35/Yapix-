import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { CustomTextProps } from "@/interface/type";
import React from "react";
import { StyleSheet, Text } from "react-native";

const CustomText: React.FC<CustomTextProps> = ({ style, ...props }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return <Text style={[styles.text, style]} allowFontScaling={false} {...props} />;
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    text: {
      color: colors.black,
      fontFamily: FONTS.regular,
    },
  });

export default CustomText;
