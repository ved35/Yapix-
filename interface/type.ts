import { ReactNode } from "react";
import { TextProps, ViewStyle } from "react-native";
import { MessageType } from "react-native-flash-message";
import { colors } from "../constants/theme";

// Auth related interfaces
export interface LoginCredentials {
  identity: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  given_name: string;
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
  password: string;
}

// User related interfaces
export interface User {
  id: string;
  email: string;
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
