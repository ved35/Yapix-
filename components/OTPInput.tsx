import { useTheme } from "@/context/ThemeContext";
import React, { memo, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface OTPInputProps {
  onOTPComplete: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ onOTPComplete }) => {
  const { colors } = useTheme();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    // Handle paste event (when text length is greater than 1)
    if (text.length > 1) {
      const pastedText = text.trim();
      // Check if pasted content is a 6-digit number
      if (/^\d{6}$/.test(pastedText)) {
        const newOtp = pastedText.split("");
        setOtp(newOtp);
        onOTPComplete(pastedText);
        // Focus the last input
        inputRefs.current[5]?.focus();
        return;
      }
    }

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
    // Handle backspace
    if (e.nativeEvent.key === "Backspace") {
      const newOtp = [...otp];
      
      // If current input is empty and not the first input, move to previous input
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        // Clear the previous input
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onOTPComplete(newOtp.join(""));
      } 
      // If current input has a value, clear it
      else if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
        onOTPComplete(newOtp.join(""));
      }
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
            maxLength={6}
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

export default memo(OTPInput);
