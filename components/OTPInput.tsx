import { useTheme } from "@/context/ThemeContext";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface OTPInputProps {
  onOTPComplete: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ onOTPComplete }) => {
  const { colors } = useTheme();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    // Only allow numbers
    if (!/^\d*$/.test(text)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Notify parent of OTP changes
    onOTPComplete(newOtp.join(""));
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={[styles.input, { borderColor: otp[index] ? colors.primary : colors.gray }]}
            maxLength={1}
            keyboardType="number-pad"
            value={otp[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default OTPInput;
