import CustomText from "@/components/CustomText";
import { StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Profile</CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
