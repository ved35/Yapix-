import { BottomSheetBackdropProps, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { StyleProp, useWindowDimensions, ViewStyle } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";

interface CustomBottomSheetModalProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  children: React.ReactNode;
}

interface BackdropProps extends BottomSheetBackdropProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  style?: StyleProp<ViewStyle>;
}

const CustomBottomSheet: React.FC<CustomBottomSheetModalProps> = ({
  children,
  bottomSheetModalRef,
}) => {
  const { height } = useWindowDimensions();

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backgroundComponent={(props) => (
        <Backdrop {...props} bottomSheetModalRef={bottomSheetModalRef} />
      )}
    >
      {children}
    </BottomSheetModal>
  );
};

const Backdrop: React.FC<BackdropProps> = ({ animatedIndex, bottomSheetModalRef, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [1, 1], [1, 1], Extrapolation.CLAMP),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: "rgba(0,0,0,0.2)",
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View onTouchStart={() => bottomSheetModalRef.current?.close} style={containerStyle} />
  );
};

export default CustomBottomSheet;
