import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface CustomSearchBarProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search',
  containerStyle,
  style,
  ...rest
}) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }, containerStyle]}>
      <Ionicons name="search" size={22} color={colors.textSecondary} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: colors.text }, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
});

export default CustomSearchBar; 