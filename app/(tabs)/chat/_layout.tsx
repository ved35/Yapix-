import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const ChatlLyout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="chat-box" options={{ headerShown: false }} />
      <Stack.Screen name="friend-request" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ChatlLyout;

const styles = StyleSheet.create({});
