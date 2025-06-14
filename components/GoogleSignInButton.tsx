import { Icons } from "@/assets/assets";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { GoogleSignInButtonProps } from "@/interface/type";
import React, { memo } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet } from "react-native";
import CustomText from "./CustomText";

const GoogleSignInButton = ({
  onPress,
  style: containerStyle,
  loading = false,
}: GoogleSignInButtonProps) => {
  const styles = getStyles();
  return (
    <Pressable style={[styles.googleBtn, containerStyle]} onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color="#222" />
      ) : (
        <>
          <Image source={Icons.google} style={styles.googleIcon} />
          <CustomText style={styles.googleText}>Continue with Google</CustomText>
        </>
      )}
    </Pressable>
  );
};

const getStyles = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    googleBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.white,
      borderRadius: 10,
      paddingVertical: 12,
      width: 260,
      justifyContent: "center",
      shadowColor: colors.black,
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 8,
    },
    googleIcon: {
      width: 20,
      height: 20,
      marginRight: 8,
    },
    googleText: {
      color: colors.black,
      fontSize: 16,
      fontFamily: FONTS.medium,
      marginTop: 2,
    },
  });
};

export default memo(GoogleSignInButton);
