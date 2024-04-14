import {
  SafeAreaView,
  Text,
  Pressable,
  Button,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Stack } from "expo-router";
import socket from "../../socket";
import { supabase } from "../../lib/supabase-client";
import { getTable } from "../../api/api";
import { FontAwesome } from "@expo/vector-icons";

const HomePage = () => {
  const [sender, setSender] = useState();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState();
  const fetchTable = async () => {
    const table = await getTable();
    setRows(table.filter((item) => item?.socketId));
  };

  useEffect(() => {
    socket.connect();
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setSender(user?.user_metadata?.name);
          socket.emit("on_load", user?.user_metadata?.name);
          setTimeout(() => {
            fetchTable();
            setLoading(false);
          }, 5000);
        } else {
          Alert.alert("Error Accessing User");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error Accessing User");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const joinChat = (receiver) => {
    console.log(receiver);
    socket.emit("join_chat", sender, receiver);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FFF9ED" }}>
      <Stack.Screen
        options={{
          headerTitle: "Users",
          headerTitleStyle: {
            fontSize: 30,
          },
          headerStyle: { backgroundColor: "#FFF9ED" },
          headerShadowVisible: false,
        }}
      />
      <View className="px-5 h-full">
        {loading ? (
          <ActivityIndicator size="large" color="black" className="h-full" />
        ) : (
          rows?.map(
            (item, index) =>
              item.name !== user?.user_metadata?.name && (
                <Link
                  href="/chat"
                  className=" w-full px-5 mb-5 border-2 rounded-[20px] justify-center bg-bgColor"
                  onPress={() => joinChat(item)}
                  key={index}
                >
                  <View className="flex-row h-20 items-center">
                    <View className="pr-3">
                      <FontAwesome
                        name="user-circle-o"
                        size={25}
                        color="black"
                      />
                    </View>
                    <Text className="w-full text-black text-xl">
                      {item.name}{" "}
                    </Text>
                  </View>
                </Link>
              )
          )
        )}
      </View>
      {/* <View className="px-5 h-full justify-end pb-5">
        <Link
          href="/chat"
          className="text-blue-500 w-full text-center border-2 p-5 text-xl "
          onPress={() => joinChat()}
        >
          Go to ChatScreen
        </Link>
      </View> */}
    </SafeAreaView>
  );
};

export default HomePage;
