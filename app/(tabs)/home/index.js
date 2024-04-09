import { SafeAreaView, Text, Pressable, Button, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Stack } from "expo-router";
import socket from "../../socket";

const HomePage = () => {
  const [chatArea, setChatArea] = useState("ChatArea");

  const joinChat = () => {
    socket.emit("join_chat", chatArea);
  };

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
      <View className="px-5 h-full justify-end pb-5">
        <Link
          href="/chat"
          className="text-blue-500 w-full text-center border-2 p-5 text-xl "
          onPress={() => joinChat()}
        >
          Go to ChatScreen
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;
