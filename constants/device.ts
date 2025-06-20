import { Dimensions, Platform } from "react-native";
import { showMessage } from "react-native-flash-message";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const isAndroid = Platform.OS === "android";
export const isIOS = Platform.OS === "ios";

export const isTablet = SCREEN_WIDTH >= 768;
export const isSmall = SCREEN_HEIGHT < 670;
export const isThin = SCREEN_WIDTH < 400;

export const showToast = (
  type: "success" | "warning" | "danger",
  message: string,
  description?: string
) => {
  showMessage({
    type: type,
    message: message,
    description: description,
  });
};
