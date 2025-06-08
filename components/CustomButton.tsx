import { FONTS } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  variant?: 'filled' | 'outlined';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  variant = 'filled',
  style,
  textStyle,
  disabled = false,
  loading = false,
}) => {
  const { colors } = useTheme();
  const styles = getStyles();

  const buttonStyles = [
    styles.button,
    variant === 'filled' ? styles.filledButton : styles.outlinedButton,
    variant === 'filled' ? { backgroundColor: colors.primary } : { borderColor: colors.primary },
    (disabled) && { opacity: 0.5 },
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'filled' ? styles.filledText : styles.outlinedText,
    variant === 'filled' ? { color: colors.white } : { color: colors.primary },
    textStyle,
  ];

  return (
    <Pressable 
      style={buttonStyles} 
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'filled' ? colors.white : colors.primary} 
          size="small"
        />
      ) : (
        <Text style={textStyles}>{text}</Text>
      )}
    </Pressable>
  );
};

const getStyles = () => {
  const {colors} = useTheme();
  return StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    width: 260,
    alignItems: 'center',
    marginBottom: 12,
  },
  filledButton: {
    borderWidth: 0,
  },
  outlinedButton: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 17,
    marginTop: 2,
    fontFamily: FONTS.medium,
  },
  filledText: {},
  outlinedText: {},
})}; 

export default CustomButton; 