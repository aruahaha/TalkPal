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
} from "react-native";
import { supabase } from "../lib/supabase-client";
import { Stack } from "expo-router";

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
    <View className="h-full px-5">
      <Stack.Screen
        options={{ headerTitle: "Login", headerTitleAlign: "center" }}
      />
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text className="text-2xl pb-2">Email</Text>
        <TextInput
          label="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          className="py-5 border-2 border-gray-500 rounded-lg px-3"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Text className="text-2xl pb-2">Password</Text>
        <TextInput
          label="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
          className="py-5 border-2 border-gray-500 rounded-lg px-3"
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Pressable
          disabled={loading}
          onPress={() => signInWithEmail()}
          className="bg-blue-500 items-center p-4 rounded-lg "
        >
          <Text className="text-white text-xl">Sign In</Text>
        </Pressable>
      </View>
      <View style={styles.verticallySpaced}>
        <Pressable
          disabled={loading}
          onPress={() => signUpWithEmail()}
          className="bg-blue-500 items-center p-4 rounded-lg "
        >
          <Text className="text-white text-xl">Sign Up</Text>
        </Pressable>
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
