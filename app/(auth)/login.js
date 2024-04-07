import React, { useState } from "react";
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
import { Stack } from "expo-router";
import LoginImage from "../../assets/images/LoginImage.png";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View className="w-full h-full">
      <ImageBackground source={LoginImage} className="w-full h-full" />
      <StatusBar />
      <Stack.Screen options={{ headerShown: false }} />
      <View className="absolute w-full items-center justify-center h-full top-[175px]">
        <View className="w-72">
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Text className="text-center pb-5 text-2xl font-bold">Login</Text>
            <Text className="text-2xl pb-1">Email</Text>
            <TextInput
              label="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              autoCapitalize={"none"}
              className="py-2 border-2 border-black rounded-lg px-3"
            />
          </View>
          <View style={styles.verticallySpaced}>
            <Text className="text-2xl pb-1">Password</Text>
            <TextInput
              label="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize={"none"}
              className="py-2 border-2 border-black rounded-lg px-3"
            />
          </View>
          {loading ? (
            <ActivityIndicator color="black" className="pt-10" size={25} />
          ) : (
            <View>
              <View style={[styles.verticallySpaced, styles.mt20]}>
                <Pressable
                  disabled={loading}
                  onPress={() => signInWithEmail()}
                  className="bg-green-600 items-center p-2 rounded-lg "
                >
                  <Text className="text-white text-lg">Sign In</Text>
                </Pressable>
              </View>
              <View style={styles.verticallySpaced}>
                <Pressable
                  disabled={loading}
                  onPress={() => signUpWithEmail()}
                  className="bg-black items-center p-2 rounded-lg "
                >
                  <Text className="text-white text-lg">Sign Up</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

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
