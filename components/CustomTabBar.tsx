import { useTheme } from "@/context/ThemeContext";
import { CustomTabBarProps, ThemeContextType } from "@/interface/type";
import { Ionicons } from "@expo/vector-icons";
import React, { JSX } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomText from "./CustomText";

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { bottom } = useSafeAreaInsets();
  const getTabIcon = (routeName: string, focused: boolean): JSX.Element => {
    const iconColor = focused ? colors.text : colors.textSecondary;
    const iconSize = 24;

    switch (routeName) {
      case "chat":
        return <Ionicons name="chatbox-outline" size={iconSize} color={iconColor} />;
      case "call":
        return <Ionicons name="call-outline" size={iconSize} color={iconColor} />;
      case "profile":
        return <Ionicons name="person-outline" size={iconSize} color={iconColor} />;
      default:
        return <Ionicons name="person-outline" size={iconSize} color={iconColor} />;
    }
  };

  const getTabLabel = (routeName: string): string => {
    switch (routeName) {
      case "chat":
        return "Chat";
      case "call":
        return "Call";
      case "profile":
        return "Profile";
      default:
        return "Profile";
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.tabContainer,{paddingBottom: bottom}]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = getTabLabel(route.name);
          const isFocused = state.index === index;

          const onPress = (): void => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={styles.tabItem}
            >
              {getTabIcon(route.name, isFocused)}
              <CustomText
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelFocused : styles.tabLabelUnfocused,
                ]}
              >
                {label}
              </CustomText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const getStyles = (colors: ThemeContextType["colors"]) => {
  return StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    tabContainer: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 15,
      paddingHorizontal: 20,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      minWidth: "100%",
    },
    tabItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 5,
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: "500",
      marginTop: 4,
    },
    tabLabelFocused: {
      color: colors.text,
    },
    tabLabelUnfocused: {
      color: colors.textSecondary,
    },
  });
};

export default CustomTabBar;
