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
  const [sender, setSender] = useState({
    name: "",
    roomId: "",
  });

  const [status, setStatus] = useState();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState();

  // const fetchTable = async () => {
  //   const table = await getTable();
  //   setRows(table.filter((item) => item?.socketId));
  // };

  useEffect(() => {
    socket.connect();
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setSender({ ...sender, name: user?.user_metadata?.name });
          socket.emit("on_load", user?.user_metadata?.name);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
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
    socket.on("users", (data) => {
      setRows(data);
    });
    socket.on("status", (data) => {
      setStatus(data.offlineUser);
    });
  }, []);

  const joinChat = (receiver) => {
    socket.emit("join_chat", receiver);
  };

  return (
    <SafeAreaView className="flex-1 " style={{ backgroundColor: "#FFF9ED" }}>
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
      <View className="px-5 w-full">
        {loading ? (
          <ActivityIndicator size="large" color="black" className="h-full" />
        ) : (
          rows?.map(
            (item, index) =>
              item.name !== user?.user_metadata?.name && (
                <Link
                  href="/chat"
                  className="bg-bgColor w-[100%] mb-5 rounded-xl px-5 "
                  onPress={() => joinChat(item)}
                  key={index}
                >
                  <View className="flex-row items-center justify-between  ">
                    <View className="flex-row items-center h-20">
                      <FontAwesome
                        name="user-circle-o"
                        size={25}
                        color="black"
                      />
                      <Text className="text-black text-xl">{item.name}</Text>
                    </View>
                    <View className="">
                      <FontAwesome
                        name="circle"
                        size={24}
                        color={status.includes(item.name) ? "red" : "green"}
                      />
                    </View>
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
