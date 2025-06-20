import { useTheme } from "@/context/ThemeContext";
import { CustomImageLoaderProps } from "@/interface/type";
import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";

const CustomImageLoadder = ({
  style,
  source,
  resizeMode = "contain",
  borderRadius = 0,
  errorImage = { uri: "https://cdn-icons-png.flaticon.com/512/190/190411.png" },
}: CustomImageLoaderProps) => {
  const { colors } = useTheme();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <View style={[styles.container, style]}>
      <Image
        resizeMode={resizeMode}
        borderRadius={borderRadius}
        style={[styles.image, style]}
        source={
          isError
            ? errorImage
            : source || { uri: "https://cdn-icons-png.flaticon.com/512/190/190411.png" }
        }
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsError(true);
          setIsLoading(false);
        }}
      />
      {isLoading && <ActivityIndicator color={colors.primary} style={styles.loader} />}
    </View>
  );
};

export default CustomImageLoadder;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    position: "absolute",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
