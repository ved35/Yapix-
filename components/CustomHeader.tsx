import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { CustomHeaderProps, ThemeContextType } from "@/interface/type";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "./CustomText";

const CustomHeader = ({ hideBackButton = false, title, rightIcons, style }: CustomHeaderProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={() => router.canGoBack() && router.back()}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" size={22} color={colors.text} />
      </Pressable>
      <CustomText style={styles.title}>{title}</CustomText>
      {rightIcons ? rightIcons() : <View style={styles.placeholderView} />}
    </View>
  );
};

export default CustomHeader;

const getStyles = (colors: ThemeContextType["colors"]) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    },
    backButton: {
      height: 40,
      width: 40,
      marginLeft: 10,
      padding: 8,
      backgroundColor: colors.surface,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontFamily: FONTS.bold,
      color: colors.text,
    },
    rightIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    placeholderView: {
      height: 40,
      width: 40,
    },
  });
};
