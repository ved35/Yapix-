import CustomTabBar from "@/components/CustomTabBar";
import { useTheme } from "@/context/ThemeContext";
import { routeWithoutSegment } from "@/hooks/useRouteSegment";
import { FontAwesome } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { useCallback } from "react";

const TabsLayout = () => {
  const { colors } = useTheme();

  const pathname = usePathname();

  const shouldHideTabBar = useCallback(() => {
    return ![
      routeWithoutSegment("tabs.chat"),
      // routeWithoutSegment("tabs.profile"),
      routeWithoutSegment("tabs.call"),
    ].includes(pathname);
  }, [pathname]);

  return (
    <Tabs
      tabBar={(props) => (!shouldHideTabBar() ? <CustomTabBar {...props} /> : undefined)} // Apply custom tab bar here
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="comments" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="call"
        options={{
          title: "Call",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="phone" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }: { color: string }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
