import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";

const { width, height } = Dimensions.get("window");

const SignInScreen = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (!isLoaded) return;
    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        Alert.alert("Error", "Sign in failed. Please try again.");
      }
    } catch (err) {
      Alert.alert("Error", err.errors?.[0]?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <LinearGradient
        colors={["#FF9A8B", "#FF6A88", "#FF99AC"]}
        style={{ position: "absolute", width, height }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={{ paddingTop: 60, paddingHorizontal: 24 }}
        >
          <Text
            style={{
              fontSize: 34,
              fontWeight: "800",
              color: "#fff",
              marginBottom: 40,
              textAlign: "center",
            }}
          >
            Welcome Back to Cider Meals
          </Text>

          <Image
            source={require("../../assets/images/i1.png")}
            style={{
              width: 120,
              height: 120,
              alignSelf: "center",
              marginBottom: 40,
            }}
            contentFit="contain"
          />

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: 24,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <TextInput
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.textLight,
                  paddingVertical: 8,
                  fontSize: 16,
                }}
                placeholder="Email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={{ marginBottom: 24, position: "relative" }}>
              <TextInput
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.textLight,
                  paddingVertical: 8,
                  fontSize: 16,
                }}
                placeholder="Password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={{ position: "absolute", right: 0, top: 8 }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleSignIn}
              disabled={loading}
              style={{
                backgroundColor: "#FF6A88",
                paddingVertical: 14,
                borderRadius: 16,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-up")}
              style={{ marginTop: 16, alignItems: "center" }}
            >
              <Text style={{ color: COLORS.text, fontWeight: "600" }}>
                Don't have an account?{" "}
                <Text style={{ color: "#FF6A88", fontWeight: "800" }}>
                  Sign Up
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 24,
              padding: 20,
              marginTop: 30,
              marginBottom: 30,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <LinearGradient
              colors={["#FF6A88", "#FF9A8B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 24,
                opacity: 0.2,
              }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#333",
                marginBottom: 12,
              }}
            >
              About Us
            </Text>
            <ScrollView
              style={{ maxHeight: 140 }}
              showsVerticalScrollIndicator={true}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#444",
                  lineHeight: 20,
                }}
              >
                Tired of complicated recipes? Cider Meals makes healthy eating
                simple and enjoyable. Get inspired with our easy-to-follow
                recipes, practical meal prep guides, and fresh seasonal ideas.
                We believe cooking should be a fun and rewarding adventure.
                Explore a world of flavor, take advantage of our weekly
                specials, and connect with fellow food lovers.
              </Text>
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignInScreen;
