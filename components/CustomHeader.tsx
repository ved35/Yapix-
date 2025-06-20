import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { ReactNode } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import CustomText from "./CustomText";

interface CustomHeaderProps {
  hideBackButton?: boolean;
  title: string;
  rightIcons?: () => ReactNode;
  style?: ViewStyle;
}

const CustomHeader = ({ hideBackButton = false, title, rightIcons, style }: CustomHeaderProps) => {
  const styles = getStyle();

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={() => router.canGoBack() && router.back()}
        style={styles.backButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-back" size={22} color="#000" />
      </Pressable>
      <CustomText style={styles.title}>{title}</CustomText>
      {rightIcons ? rightIcons() : <View style={{ height: 40, width: 40 }} />}
    </View>
  );
};

export default CustomHeader;

const getStyle = () => {
  const { colors } = useTheme();

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
      backgroundColor: colors.lightGray,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontFamily: FONTS.bold,
      color: colors.black,
    },
    rightIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
  });
};
