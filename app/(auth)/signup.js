import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  TextInput,
  Button,
  Text,
  Pressable,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { supabase } from "../lib/supabase-client";
import { Stack, router } from "expo-router";
import LoginImage from "../../assets/images/LoginImage.png";

const signup = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [takenUsernames, setTakenUsernames] = useState([]);
  const [showPassWord, setShowPassWord] = useState(true);

  useEffect(() => {
    const getTable = async () => {
      let { data: TalkPal, error } = await supabase.from("TalkPal").select("*");
      if (error) {
        console.log(error);
      }
      if (TalkPal) {
        setTakenUsernames(TalkPal);
      }
    };
    getTable();
  }, []);

  async function signUpWithEmail() {
    setLoading(true);

    const isUsernameTaken = takenUsernames?.some(
      (user) => user?.name === userName
    );
    if (isUsernameTaken) {
      Alert.alert("Username already exists. Please choose a different one.");
      setLoading(false);
      return;
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: userName,
        },
      },
    });

    const addRow = async () => {
      const { data, error } = await supabase
        .from("TalkPal")
        .insert([{ email: email, name: userName }]);
    };

    if (error) Alert.alert(error.message);
    if (!session) {
      addRow();
      Alert.alert("Please check your inbox for email verification!");
    }
    setLoading(false);
  }

  const handleShowPassWord = () => {
    setShowPassWord((prev) => !prev);
    console.log(showPassWord);
  };
  const handleSignUp = () => {
    router.push("/login");
  };

  return (
    <View className="w-full h-full">
      <ImageBackground source={LoginImage} className="w-full h-full" />
      <StatusBar />
      <Stack.Screen options={{ headerShown: false }} />
      <View className="absolute w-full items-center justify-center h-full top-[175px]">
        <View className="w-72">
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Text className="text-center text-2xl font-bold">SignUp</Text>
            <Text className="text-2xl pb-1">Email</Text>
            <TextInput
              label="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              autoCapitalize={"none"}
              className="py-1 border-2 border-black rounded-lg bg-white px-3"
            />
          </View>
          <View>
            <Text className="text-2xl pb-1">Username</Text>
            <TextInput
              label="Name"
              onChangeText={(text) => setUserName(text)}
              value={userName}
              placeholder="Display Name"
              autoCapitalize={"none"}
              className="py-1 border-2 border-black rounded-lg bg-white px-3"
            />
          </View>
          <View style={styles.verticallySpaced}>
            <Text className="text-2xl pb-1">Password</Text>
            <View>
              <View>
                <TextInput
                  label="Password"
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  secureTextEntry={showPassWord}
                  placeholder="Password"
                  autoCapitalize={"none"}
                  className="py-1 border-2 border-black rounded-lg bg-white px-3"
                />
              </View>
              <View className="absolute w-full h-full items-end">
                <Pressable
                  onPress={() => handleShowPassWord()}
                  className="bg-black px-5 rounded-r-lg h-full justify-center"
                >
                  {showPassWord ? (
                    <Text className="text-white">Show</Text>
                  ) : (
                    <Text className="text-white">Hide</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
          {loading ? (
            <ActivityIndicator color="black" className="pt-10" size={25} />
          ) : (
            <View>
              <View style={(styles.verticallySpaced, styles.mt20)}>
                <Pressable
                  disabled={loading}
                  onPress={() => signUpWithEmail()}
                  className="bg-black items-center p-1 rounded-lg "
                >
                  <Text className="text-white text-lg">Sign Up</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
        <View className="flex-row pt-5 ">
          <Text>Already have an account </Text>
          <Pressable onPress={() => handleSignUp()}>
            <Text className="text-blue-700">Login</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});

export default signup;
