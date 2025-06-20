import React, { memo } from "react";
import { StyleSheet, Text, TextProps } from "react-native";

const CustomText: React.FC<TextProps> = ({ ...props }) => {
  const styles = getStyles();
  return (
    <Text allowFontScaling={false} style={[styles.text, props.style]} {...props}>
      {props.children}
    </Text>
  );
};

const getStyles = () =>
  StyleSheet.create({
    text: {
      verticalAlign: "middle",
      includeFontPadding: false,
      textAlignVertical: "center",
    },
  });

export default memo(CustomText);
