import { SafeAreaView, Text, Pressable, Button } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";

const HomePage = () => {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FFF9ED" }}>
      <Stack.Screen
        options={{
          headerTitle: "Your Friends",
          headerTitleStyle: {
            fontSize: 30,
          },
          headerStyle: { backgroundColor: "#FFF9ED" },
          headerShadowVisible: false,
        }}
      />
    </SafeAreaView>
  );
};

export default HomePage;
