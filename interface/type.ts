import { BottomSheetBackdropProps, BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ReactNode } from "react";
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextInputProps,
  TextProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { MessageType } from "react-native-flash-message";
import { PermissionStatus } from "react-native-permissions";
import { colors } from "../constants/theme";

// Auth related interfaces
export interface LoginCredentials {
  identity: string;
  password: string;
}

export interface editProfileData {
  username: string;
  name: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  name: string;
}

export interface GoogleData {
  email: string;
  name: string;
  profile_pic: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface PasswordResetData {
  email: string;
}

export interface NewPasswordData {
  email: string;
  newPassword: string;
}

export interface VerifyOTPData {
  otp: string;
  email: string;
}

// User related interfaces
export interface User {
  id: string;
  email: string;
  username: string;
  profile_picture: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;

  setUser: (user: User | null) => void;
}

// Flash Message interface
export interface FlashMessageOptions {
  message: string;
  description?: string;
  type?: MessageType;
  duration?: number;
  icon?: MessageType;
  hideStatusBar?: boolean;
  floating?: boolean;
  position?: "top" | "bottom" | "center";
}

// Theme related interfaces
export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof colors.light;
}

// Language related interfaces
export interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
}

// Component Props interfaces
export interface GoogleSignInButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  loading?: boolean;
}

export interface GradientViewProps {
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  children?: ReactNode;
}

export interface CustomTextProps extends TextProps {
  style?: TextProps["style"];
}

export interface CustomImageLoaderProps {
  style: ImageStyle;
  source: ImageSourcePropType | null;
  resizeMode: "contain" | "cover" | "stretch" | "repeat" | "center";
  borderRadius?: number;
  errorImage?: ImageSourcePropType;
}

// Custom Bottom Sheet interfaces
export interface CustomBottomSheetModalProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  children: React.ReactNode;
}

export interface BackdropProps extends BottomSheetBackdropProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  style?: StyleProp<ViewStyle>;
}

// Custom Button interface
export interface CustomButtonProps {
  text: string;
  onPress: () => void;
  variant?: "filled" | "outlined";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

// Custom Header interface
export interface CustomHeaderProps {
  hideBackButton?: boolean;
  title: string;
  rightIcons?: () => ReactNode;
  style?: ViewStyle;
}

// Custom Tab Bar interface
export interface CustomTabBarProps extends BottomTabBarProps {}

// Custom Text Input interface
export interface CustomTextInputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  password?: boolean;
  error?: string;
}

// OTP Input interface
export interface OTPInputProps {
  onOTPComplete: (otp: string) => void;
}

// Permission Hook interface
export interface PermissionHookResult {
  status: PermissionStatus;
  requestPermissions: () => Promise<PermissionStatus>;
  checkPermissions: () => Promise<PermissionStatus>;
}

// Validation Schema types
export type SignUpFormData = {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignInFormData = {
  username: string;
  password: string;
};

export type OTPFormData = {
  otp: string;
};

export type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

export interface changePasswordData {
  newPassword: string;
  currentPassword: string;
}

export type ChangePasswordFormData = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

export interface EditFormData {
  username: string;
  name: string;
  profile_picture: string;
  email: string;
}
