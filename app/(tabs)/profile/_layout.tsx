import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const ProfilelLyout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ProfilelLyout;

const styles = StyleSheet.create({});
