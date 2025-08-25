import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Redirect href={"/"} />;

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#E1F5FE" },
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Ionicons name="laptop" size={24} />
          </View>
        ),
      }}
    />
  );
}
