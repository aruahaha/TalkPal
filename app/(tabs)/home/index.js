import { SafeAreaView, Text, Pressable, Button } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";

const home = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <Stack.Screen options={{ headerTitle: "TalkPal" }} />
      <Text className="text-white p-4 text-xl">Home</Text>
    </SafeAreaView>
  );
};

export default home;
