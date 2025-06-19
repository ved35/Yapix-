import CustomText from "@/components/CustomText";
import { StyleSheet, View } from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      <View style={{width: '90%', flex:1, alignItems: 'center'}}>
      {/* <CustomHeader title="Profile" style={{marginTop: 50}} /> */}
      <CustomText style={styles.title}>Profile</CustomText>
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
    fontSize: 24,
    fontWeight: "bold",
  },
});
