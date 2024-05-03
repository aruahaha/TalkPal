import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  FlatList,
  Keyboard,
  BackHandler,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Link, Stack, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import socket from "../socket";
import { supabase } from "../lib/supabase-client";
import { getTable } from "../api/api";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = () => {
  const [sender, setSender] = useState();
  const [currentMessage, setCurrentMessage] = useState("");
  const [receiver, setReceiver] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [user, setUser] = useState(null);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        Alert.alert("Error Accessing User");
      }
    });

    const fetchTable = async () => {
      const table = await getTable();
      setRows(table);
    };

    fetchTable();

    socket.on("receiver", (receiver) => {
      setReceiver(receiver);
    });
    socket.on("status", (data) => {
      setStatus(data.offlineUser);
    });
  }, []);
  const scrollViewRef = useRef();

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const time =
        hours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + ampm;
      const messageData = {
        receiverId: receiver.socketId,
        message: currentMessage,
        time: time,
        user: user?.user_metadata?.name,
      };
      setSender(user?.user_metadata?.name);
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
          headerTitle: receiver.name,
          headerLeft: () => (
            <Link
              href="/"
              onPress={() => {
                setMessageList([]);
                socket.disconnect();
              }}
            >
              Back
            </Link>
          ),
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
                  ? "items-end my-1 mx-5 relative"
                  : "items-start my-1 mx-5 relative"
              }
              key={index}
            >
              <View
                className={
                  item.user === user?.user_metadata?.name
                    ? "bg-bgColor p-3 rounded-l-lg rounded-lg  relative "
                    : "bg-gray-300 p-3 rounded-r-lg rounded-lg  relative"
                }
              >
                <View className="w-[70%]">
                  <Text className="mb-1 text-[16px]">{item.message}</Text>
                  <Text
                    className={
                      item.user === user?.user_metadata?.name
                        ? "text-gray-600 text-[10px] font-bold text-left"
                        : "text-gray-600 text-[10px] font-bold text-right"
                    }
                  >
                    {item.time}
                  </Text>
                </View>
                <View
                  className={
                    index === 0 ||
                    (index > 0 && item.user !== messageList[index - 1].user)
                      ? item.user === user?.user_metadata?.name
                        ? "absolute right-0 h-5 w-5  bg-bgColor top-0 transform translate-x-1 -translate-y-[3.7px] rounded-tl-[20px]  rotate-45"
                        : "absolute left-0 h-5 w-5  bg-gray-300 top-0 transform -translate-x-1 -translate-y-[3.7px] rounded-tl-[20px] rotate-45"
                      : ""
                  }
                ></View>
              </View>
            </View>
          ))}
        </ScrollView>
        <View className="flex-row w-full justify-between mb-4 px-4 h-14">
          <View className="w-3/4">
            <TextInput
              className="h-full px-3 bg-[#31363F] text-white rounded-l-lg"
              multiline={true}
              numberOfLines={3}
              placeholder="Type your message...."
              placeholderTextColor="white"
              value={currentMessage}
              onChangeText={(value) => setCurrentMessage(value)}
            />
          </View>
          <View className="justify-center items-center w-1/4 bg-[#31363F] rounded-r-lg ">
            {currentMessage.length > 0 ? (
              <Pressable onPress={() => sendMessage()}>
                <FontAwesome name="send" size={24} color="white" />
              </Pressable>
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;
