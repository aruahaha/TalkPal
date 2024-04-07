import { SafeAreaView, Text, Pressable, Button } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";

const home = () => {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FFF9ED" }}>
      <Stack.Screen
        options={{
          headerTitle: "TalkPal",
          headerStyle: { backgroundColor: "#92C4B3" },
        }}
      />
      <Text className="text-black p-4 text-2xl">Your Friends</Text>
    </SafeAreaView>
  );
};

export default home;
