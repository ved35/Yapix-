import { Icons } from "@/assets/assets";
import CustomHeader from "@/components/CustomHeader";
import CustomImageLoadder from "@/components/CustomImageLoadder";
import CustomText from "@/components/CustomText";
import { FONTS } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useLogoutMutation } from "@/hooks/mutations/authMutations";
import Storage from "@/hooks/Storage";
import useAuthStore from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from "react-native";

export default function Profile() {
  const { colors } = useTheme();

  const user = useAuthStore((state) => state.user);
  const setuser = useAuthStore((state) => state.setUser);
  const logoutMutation = useLogoutMutation();

  const handleLogOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout", [
      {
        text: "No",
      },
      {
        text: "Yes",
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

  return (
    <View style={styles.container}>
      <View style={{ width: "90%", flex: 1, alignItems: "center" }}>
        <CustomHeader title="Profile" style={{ marginTop: 50 }} />
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <CustomImageLoadder
              source={{
                uri: "https://cdn.pixabay.com/photo/2022/09/01/22/42/woman-7426320_1280.png",
              }}
              resizeMode="cover"
              style={{ height: 100, width: 100 }}
              borderRadius={100}
            />
            <View style={{}}>
              <CustomText style={{ fontSize: 24, fontFamily: FONTS.semiBold, color: colors.black }}>
                {user?.username}
              </CustomText>
              <CustomText style={{ fontSize: 18, fontFamily: FONTS.medium, color: colors.gray }}>
                {user?.email}
              </CustomText>
            </View>
          </View>
          <Pressable
            style={{
              height: 50,
              width: 50,
              borderRadius: 50,
              backgroundColor: colors.lightGray,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleLogOut}
          >
            {logoutMutation?.isPending ? (
              <ActivityIndicator color={colors.black} size={30} />
            ) : (
              <Ionicons name="log-out-outline" style={{ color: colors.black }} size={30} />
            )}
          </Pressable>
        </View>
        <View
          style={{ height: 1, width: "100%", backgroundColor: colors.gray, marginVertical: 20 }}
        />
        <Pressable
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <CustomImageLoadder
              source={Icons.password}
              style={{ height: 35, width: 34 }}
              borderRadius={5}
              resizeMode="contain"
            />
            <CustomText style={{ fontSize: 16, fontFamily: FONTS.medium, color: colors.black }}>
              Change Password
            </CustomText>
          </View>
          <Ionicons name="chevron-forward" size={25} color={colors.black} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
});
