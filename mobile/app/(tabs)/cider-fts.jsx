import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
let globalTimer = { endTime: null, running: false };

const VibeCookScreen = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [tip, setTip] = useState("");
  const [nextRecipe, setNextRecipe] = useState("");
  const [progress] = useState(new Animated.Value(0));

  const tips = [
    "Use fresh herbs for better flavor",
    "Preheat the pan before cooking",
    "Clean as you go",
    "Taste while cooking",
    "Balance sweet and salty",
  ];

  const recipes = [
    "Spaghetti Bolognese",
    "Salmon Avocado Salad",
    "Wontons",
    "Beaver Tails",
    "Kumpir",
    "Summer Pudding",
    "Minced Beef Pie",
    "Apple Frangipan Tart",
    "Mince Pies",
    "Jerk Chicken with rice & peas",
    "Ratatouille",
    "Chicken Quinoa Greek Salad",
  ];

  useEffect(() => {
    const randomNext = recipes[Math.floor(Math.random() * recipes.length)];
    setNextRecipe(randomNext);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startTimer = (minutes) => {
    const now = Date.now();
    const additional = minutes * 60 * 1000;
    const newEnd = globalTimer.running
      ? globalTimer.endTime + additional
      : now + additional;
    globalTimer.endTime = newEnd;
    globalTimer.running = true;
    setRunning(true);
    setTip(tips[Math.floor(Math.random() * tips.length)]);
    const remainingSec = Math.max(
      Math.ceil((globalTimer.endTime - Date.now()) / 1000),
      0
    );
    setTimeLeft(remainingSec);
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: remainingSec * 1000,
      useNativeDriver: false,
    }).start();
  };

  const reset = () => {
    setTimeLeft(0);
    setRunning(false);
    globalTimer.running = false;
    globalTimer.endTime = null;
    progress.setValue(0);
  };

  useEffect(() => {
    const tick = () => {
      if (!globalTimer.running) return;
      const remainingSec = Math.max(
        Math.ceil((globalTimer.endTime - Date.now()) / 1000),
        0
      );
      setTimeLeft(remainingSec);
      if (remainingSec === 0) globalTimer.running = false;
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const buttonGradients = ["#FF6EC7", "#b04ca9ff", "#7a5fc6ff"];

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1755510603500-e32c82143ef1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }}
      style={{ flex: 1 }}
      imageStyle={{ opacity: 0.5 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: width * 0.85,
            height: width * 0.85,
            borderRadius: width,
            borderWidth: 8,
            borderColor: "rgba(255,255,255,0.3)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
            backgroundColor: "rgba(0,0,0,0.2)",
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 12,
          }}
        >
          <Text style={{ fontSize: 48, color: "#fff", fontWeight: "900" }}>
            {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
          </Text>
          <Text style={{ color: "#fff", fontSize: 18, marginTop: 6 }}>
            Focus Time
          </Text>
          <View
            style={{
              height: 10,
              width: "70%",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 5,
              overflow: "hidden",
              marginTop: 20,
            }}
          >
            <Animated.View
              style={{
                height: 10,
                width: progressWidth,
                backgroundColor: "#fff",
                borderRadius: 5,
              }}
            />
          </View>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 24 }}>
          {[5, 10, 20].map((m, i) => (
            <TouchableOpacity
              key={m}
              onPress={() => startTimer(m)}
              style={{
                flex: 1,
                marginHorizontal: 6,
                paddingVertical: 16,
                borderRadius: 20,
                backgroundColor: buttonGradients[i],
                alignItems: "center",
                shadowColor: buttonGradients[i],
                shadowOpacity: 0.4,
                shadowRadius: 10,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                {m} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {running && (
          <TouchableOpacity
            onPress={reset}
            style={{
              marginBottom: 32,
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 24,
              backgroundColor: "#FF3B82",
              shadowColor: "#FF3B82",
              shadowOpacity: 0.35,
              shadowRadius: 12,
            }}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "700", marginLeft: 10 }}>
              Reset
            </Text>
          </TouchableOpacity>
        )}

        <View
          style={{
            width: width * 0.85,
            padding: 20,
            borderRadius: 24,
            backgroundColor: "#6ba6c1ff",
            marginBottom: 20,
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 1,
            shadowRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#fff",
              marginBottom: 8,
            }}
          >
            Quick Cooking Tip
          </Text>
          <Text style={{ fontSize: 16, color: "#fff", textAlign: "center" }}>
            {tip || "Start the timer to get a tip!"}
          </Text>
        </View>

        <View
          style={{
            width: width * 0.85,
            padding: 20,
            borderRadius: 24,
            backgroundColor: "#466b7cff",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 1,
            shadowRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#fff",
              marginBottom: 8,
            }}
          >
            Your Next Recipe Idea
          </Text>
          <Text style={{ fontSize: 16, color: "#fff", textAlign: "center" }}>
            {nextRecipe}
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default VibeCookScreen;
