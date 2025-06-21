import { Icons } from "@/assets/assets";
import CustomHeader from "@/components/CustomHeader";
import CustomImageLoadder from "@/components/CustomImageLoadder";
import CustomText from "@/components/CustomText";
import { FONTS } from "@/constants/theme";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useLogoutMutation } from "@/hooks/mutations/authMutations";
import Storage from "@/hooks/Storage";
import { ThemeContextType } from "@/interface/type";
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Switch, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { colors, theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const styles = getStyles(colors, language);
  const { t } = useTranslation();

  const user = useAuthStore((state) => state.user);
  const setuser = useAuthStore((state) => state.setUser);
  const logoutMutation = useLogoutMutation();

  const settingsItems = [
    {
      id: 1,
      name: t("profile.editProfile"),
      icon: Icons.edit,
    },
    {
      id: 2,
      name: t("profile.changePassword"),
      icon: Icons.password,
    },
    {
      id: 3,
      name: t("profile.qrCode"),
      icon: Icons.qr,
    },
    {
      id: 4,
      name: t("profile.notification"),
      icon: Icons.notification,
      enabled: true,
    },
    {
      id: 5,
      name: t("profile.darkMode"),
      icon: theme === "dark" ? Icons.light : Icons.dark,
      enabled: theme === "dark",
    },
    {
      id: 6,
      name: t("common.language"),
      icon: Icons.translate,
    },
    {
      id: 7,
      name: t("profile.subscription"),
      icon: Icons.subscription,
    },
    {
      id: 8,
      name: t("profile.blockList"),
      icon: Icons.block,
    },
    {
      id: 9,
      name: t("profile.helpSupport"),
      icon: Icons.helpSupport,
    },
    {
      id: 10,
      name: t("profile.privacyPolicy"),
      icon: Icons.privacyPolicy,
    },
    {
      id: 11,
      name: t("profile.termsConditions"),
      icon: Icons.termsConditions,
    },
    {
      id: 12,
      name: t("profile.deleteAccount"),
      icon: Icons.delete,
    },
  ];

  const handleLogOut = async () => {
    Alert.alert(t("profile.logout"), t("profile.logoutConfirm"), [
      {
        text: t("profile.no"),
      },
      {
        text: t("profile.yes"),
        onPress: async () => {
          const res = await logoutMutation.mutateAsync();

          if (res?.success) {
            Storage.removeItem("token");
            Storage.removeItem("refreshToken");
            setuser(null);
            router.replace("/");
          }
        },
      },
    ]);
  };

  const handleLanguageChange = () => {
    const newLanguage = language === "en" ? "guj" : "en";
    changeLanguage(newLanguage);
  };

  const handleSettingsPress = (item: any) => {
    switch (item.id) {
      case 1: // Edit Profile
        console.log("Navigate to Edit Profile");
        // router.push("/edit-profile");
        break;
      case 2: // Change Password
        console.log("Navigate to Change Password");
        // router.push("/change-password");
        break;
      case 3: // QR Code
        console.log("Navigate to QR Code");
        // router.push("/qr-code");
        break;
      case 4: // Notification
        // Toggle notification settings
        console.log("Toggle notification settings");
        break;
      case 5: // Dark Mode
        toggleTheme();
        break;
      case 6: // Language
        handleLanguageChange();
        break;
      case 7: // Subscription
        console.log("Navigate to Subscription");
        // router.push("/subscription");
        break;
      case 8: // Block List
        console.log("Navigate to Block List");
        // router.push("/block-list");
        break;
      case 9: // Help & Support
        console.log("Navigate to Help & Support");
        // router.push("/help-support");
        break;
      case 10: // Privacy and Policy
        console.log("Navigate to Privacy and Policy");
        // router.push("/privacy-policy");
        break;
      case 11: // Terms and Conditions
        console.log("Navigate to Terms and Conditions");
        // router.push("/terms-conditions");
        break;
      case 12: // Delete Account
        Alert.alert(t("profile.deleteAccount"), t("profile.deleteAccountConfirm"), [
          { text: t("profile.cancel"), style: "cancel" },
          {
            text: t("profile.delete"),
            style: "destructive",
            onPress: () => {
              console.log("Navigate to Delete Account");
              // router.push("/delete-account");
            },
          },
        ]);
        break;
      default:
        console.log("Unknown setting item:", item.name);
    }
  };

  const renderSettingsItem = ({ item }: { item: any }) => (
    <Pressable style={styles.settingsItem} onPress={() => handleSettingsPress(item)}>
      <View style={styles.settingsItemLeft}>
        <CustomImageLoadder
          source={item.icon}
          style={styles.settingsIcon}
          borderRadius={5}
          resizeMode="contain"
        />

        <View style={styles.settingsTextContainer}>
          <CustomText style={styles.settingsText}>{item.name}</CustomText>
        </View>
      </View>
      {item.enabled !== undefined ? (
        <Switch
          value={item.enabled}
          onValueChange={() => handleSettingsPress(item)}
          trackColor={{ false: colors.surface, true: colors.primary }}
          thumbColor={theme === "light" ? colors.white : colors.surface}
        />
      ) : item.id === 6 ? (
        <CustomText style={styles.languageText}>
          {language === "en" ? t("profile.english") : t("profile.gujarati")}
        </CustomText>
      ) : (
        <Ionicons name="chevron-forward" size={25} color={colors.text} />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <CustomHeader title={t("profile.title")} style={styles.header} />
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <CustomImageLoadder
              source={{
                uri: "https://cdn.pixabay.com/photo/2022/09/01/22/42/woman-7426320_1280.png",
              }}
              resizeMode="cover"
              style={styles.profileImage}
              borderRadius={100}
            />
            <View style={styles.profileTextContainer}>
              <CustomText style={styles.profileName}>{user?.username}</CustomText>
              <CustomText style={styles.profileEmail}>{user?.email}</CustomText>
            </View>
          </View>
          <Pressable style={styles.logoutButton} onPress={handleLogOut}>
            {logoutMutation?.isPending ? (
              <ActivityIndicator color={colors.text} size={30} />
            ) : (
              <Ionicons name="log-out-outline" style={styles.logoutIcon} size={30} />
            )}
          </Pressable>
        </View>
        <View style={styles.divider} />
        <Animated.FlatList
          data={settingsItems}
          renderItem={renderSettingsItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          style={styles.settingsList}
          contentContainerStyle={styles.settingsListContent}
          bounces={false}
        />
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: ThemeContextType["colors"], language: string) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.background,
    },
    contentContainer: {
      width: "90%",
      flex: 1,
      alignItems: "center",
    },
    header: {
      marginTop: 1,
    },
    profileSection: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 20,
    },
    profileInfo: {
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
    },
    profileImage: {
      height: 100,
      width: 100,
    },
    profileTextContainer: {
      // Empty for now, can add styles if needed
    },
    profileName: {
      fontSize: 24,
      fontFamily: FONTS.semiBold,
      color: colors.text,
    },
    profileEmail: {
      fontSize: 18,
      fontFamily: FONTS.medium,
      color: colors.textSecondary,
    },
    logoutButton: {
      height: 50,
      width: 50,
      borderRadius: 50,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    logoutIcon: {
      color: colors.text,
    },
    divider: {
      height: 1,
      width: "100%",
      backgroundColor: colors.border,
      marginVertical: 20,
    },
    settingsList: {
      width: "100%",
      flex: 1,
    },
    settingsListContent: {
      paddingBottom: 20,
    },
    settingsItem: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingsItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    settingsIcon: {
      height: 35,
      width: 34,
    },
    settingsTextContainer: {
      flexDirection: "column",
    },
    settingsText: {
      fontSize: 16,
      fontFamily: FONTS.medium,
      color: colors.text,
    },
    languageText: {
      fontSize: 14,
      fontFamily: FONTS.medium,
      color: colors.textSecondary,
    },
  });
};
