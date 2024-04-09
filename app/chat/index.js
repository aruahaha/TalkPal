import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  FlatList,
  Keyboard,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import socket from "../socket";
import { supabase } from "../lib/supabase-client";

const ChatScreen = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        Alert.alert("Error Accessing User");
        setLoading(false);
      }
    });
  }, []);

  const scrollViewRef = useRef();

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: "ChatArea",
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        user: user?.user_metadata?.name,
      };
      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };
  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);

      scrollViewRef.current.scrollToEnd({ animated: true });
    };

    socket.on("receive_message", receiveMessageHandler);

    return () => {
      socket.off("receive_message", receiveMessageHandler);
    };
  }, [socket]);

  return (
    <View className="flex-1 w-full h-full bg-[#FFF9ED]">
      <Stack.Screen
        options={{
          headerTitle: "ChatArea",
        }}
      />
      <View className="h-full w-full justify-between">
        <ScrollView
          ref={scrollViewRef}
          className="w-full mt-2"
          showsVerticalScrollIndicator={false}
        >
          {messageList.map((item, index) => (
            <View
              className={
                item.user === user?.user_metadata?.name
                  ? "items-end my-1 mx-5"
                  : "items-start my-1 mx-5"
              }
              key={index}
            >
              <Text>{item.user}</Text>
              <Text
                className={
                  item.user === user?.user_metadata?.name
                    ? "bg-bgColor p-3 rounded-l-lg rounded-tr-lg"
                    : "bg-gray-300 p-3 rounded-r-lg rounded-tl-lg"
                }
              >
                {item.message}
              </Text>
              <Text>{item.time}</Text>
            </View>
          ))}
        </ScrollView>
        <View className="w-full">
          <View>
            <View className="flex-row w-[80%] justify-between ">
              <View className="w-full">
                <TextInput
                  className="border-2 px-5 text-black bg-bgColor"
                  multiline={true}
                  numberOfLines={3}
                  placeholder="Type your message.."
                  value={currentMessage}
                  onChangeText={(value) => setCurrentMessage(value)}
                />
              </View>
              <View className="justify-center items-center w-[25%] border-2">
                <Pressable className="" onPress={() => sendMessage()}>
                  <Text>
                    <FontAwesome name="send" size={24} color="black" />
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;
