import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 70,
          backgroundColor: "#92C4B3",
          paddingTop: 10,
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#FFF9ED",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={35} color={color} />
          ),
          tabBarLabel: "",
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={35} color={color} />
          ),
          tabBarLabel: "",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
