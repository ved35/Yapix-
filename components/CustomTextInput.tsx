import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  password?: boolean;
  error?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  containerStyle,
  style,
  password = false,
  secureTextEntry,
  error,
  ...props
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label} allowFontScaling={false}>
          {label}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, error && styles.inputError, style]}
          placeholderTextColor={colors.gray}
          secureTextEntry={password && !showPassword}
          allowFontScaling={false}
          {...props}
        />
        {password && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color={colors.gray}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.errorText} allowFontScaling={false}>
          {error}
        </Text>
      )}
    </View>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      marginBottom: 0,
    },
    label: {
      fontSize: 14,
      color: colors.black,
      fontFamily: FONTS.medium,
      marginBottom: 4,
      marginTop: 12,
    },
    inputWrapper: {
      position: "relative",
      flexDirection: "row",
      alignItems: "center",
    },
    input: {
      width: "100%",
      height: 50,
      borderColor: colors.lightGray,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      backgroundColor: colors.white,
      color: colors.black,
      fontSize: 14,
      fontFamily: FONTS.regular,
    },
    inputError: {
      borderColor: colors.red,
    },
    eyeIcon: {
      position: "absolute",
      right: 12,
      top: 15,
    },
    errorText: {
      color: colors.red,
      fontSize: 12,
      fontFamily: FONTS.regular,
      marginTop: 4,
    },
  });

export default CustomTextInput;
