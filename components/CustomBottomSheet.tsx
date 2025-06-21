import { BackdropProps, CustomBottomSheetModalProps } from "@/interface/type";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { SafeAreaView, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";

const CustomBottomSheet: React.FC<CustomBottomSheetModalProps> = ({
  children,
  bottomSheetModalRef,
}) => {
  const { height } = useWindowDimensions();
  const styles = getStyles();

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backgroundComponent={(props) => (
        <Backdrop {...props} bottomSheetModalRef={bottomSheetModalRef} />
      )}
      index={0}
      maxDynamicContentSize={height * 0.8}
      backgroundStyle={styles.backgroundStyle}
    >
      <BottomSheetScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <SafeAreaView>
          <View style={styles.contentContainer}>{children}</View>
        </SafeAreaView>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const Backdrop: React.FC<BackdropProps> = ({ animatedIndex, bottomSheetModalRef, style }) => {
  const styles = getStyles();

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [1, 1], [1, 1], Extrapolation.CLAMP),
  }));

  const containerStyle = useMemo(
    () => [style, styles.backdropStyle, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View onTouchStart={() => bottomSheetModalRef.current?.close} style={containerStyle} />
  );
};

const getStyles = () => {
  return StyleSheet.create({
    backgroundStyle: {
      backgroundColor: "#f6f6f6",
    },
    contentContainer: {
      paddingBottom: 30,
    },
    backdropStyle: {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
  });
};

export default CustomBottomSheet;
