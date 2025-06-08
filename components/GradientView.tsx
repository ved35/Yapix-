import { GradientViewProps } from "@/interface/type";
import React from "react";
import { StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const GradientView: React.FC<GradientViewProps> = ({
  colors = ["#4c669f", "#3b5998", "#192f6a"],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  children,
}) => {
  return (
    <LinearGradient colors={colors} start={start} end={end} style={[styles.container, style]}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientView;
