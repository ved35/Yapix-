import { useTheme } from "@/context/ThemeContext";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const Dot = ({ index }: { index: number }) => {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      index * 300,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.3, { duration: 500, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );
  }, [opacity, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return <Animated.View style={[styles.dot, { backgroundColor: colors.textSecondary }, animatedStyle]} />;
};

const TypingIndicator = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.bubble, { backgroundColor: colors.surface }]}>
      <View style={styles.container}>
        <Dot index={0} />
        <Dot index={1} />
        <Dot index={2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 5,
    borderBottomLeftRadius: 0,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});

export default TypingIndicator; 