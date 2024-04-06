import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        options={{
          headerTitle: "TalkPal",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "black",
        }}
        name="(tabs)"
      />
    </Stack>
  );
};

export default StackLayout;
