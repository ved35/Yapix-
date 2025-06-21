const commonColor = {};

export const colors = {
  light: {
    background: "#FFFFFF",
    surface: "#F8F9FA",
    primary: "#4361EE",
    text: "#212529",
    textSecondary: "#6C757D",
    border: "#DEE2E6",
    error: "#BA181B",
    accent: "#3B82F6",
    // For backwards compatibility, mapping old names.
    black: "#212529", // text
    white: "#FFFFFF", // background
    gray: "#6C757D", // Mapped to textSecondary
    lightGray: "#DEE2E6", // Mapped to border
    red: "#BA181B", // Mapped to error
  },
  dark: {
    background: "#1E1E1E",
    surface: "#2A2A2A",
    primary: "#8FAAFF",
    text: "#E1E1E6",
    textSecondary: "#A3A3A3",
    border: "#3A3A3A",
    error: "#FF6B6B",
    accent: "#75A8FF",
    // For backwards compatibility, mapping old names.
    black: "#E1E1E6", // text
    white: "#1E1E1E", // background
    gray: "#A3A3A3", // textSecondary
    lightGray: "#3A3A3A", // border
    red: "#FF6B6B", // error
  },
};

export const FONTS = {
  regular: "Font-Regular",
  medium: "Font-Medium",
  light: "Font-Light",
  semiBold: "Font-SemiBold",
  bold: "Font-Bold",
  extraBold: "Font-ExtraBold",
  black: "Font-Black",
};
