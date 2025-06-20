import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const CalllLyout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default CalllLyout;

const styles = StyleSheet.create({});
