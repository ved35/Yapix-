import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { JSX } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "./CustomText";

interface CustomTabBarProps extends BottomTabBarProps {}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  const getTabIcon = (routeName: string, focused: boolean): JSX.Element => {
    const iconColor = focused ? "#000000" : "#999999";
    const iconSize = 24;

    switch (routeName) {
      case "chat":
        return <Ionicons name="home-outline" size={iconSize} color={iconColor} />;
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
        return "Home";
      case "call":
        return "Call";
      case "profile":
        return "Profile";
      default:
        return "Profile";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
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
              <CustomText style={[styles.tabLabel, { color: isFocused ? "#000000" : "#999999" }]}>
                {label}
              </CustomText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
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
});

export default CustomTabBar;
