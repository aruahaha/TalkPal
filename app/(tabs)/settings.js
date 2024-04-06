import { View, Text, Alert, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase-client";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        Alert.alert("Error Accessing User");
      }
    });
  }, []);

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error Signing Out", error.message);
    }
  };
  return (
    <View className="items-center ">
      <Text className="py-5">{JSON.stringify(user)}</Text>
      <Button title="Logout" onPress={logOut} />
    </View>
  );
};

export default SettingsPage;
