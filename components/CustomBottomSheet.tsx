import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { SafeAreaView, StyleProp, useWindowDimensions, View, ViewStyle } from "react-native";
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
      index={0}
      maxDynamicContentSize={height * 0.8}
      backgroundStyle={{
        backgroundColor: "#f6f6f6",
      }}
    >
      <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      >
        <SafeAreaView>
          <View style={{paddingBottom:30}}>
            {children}
          </View>
        </SafeAreaView>
      </BottomSheetScrollView>
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
