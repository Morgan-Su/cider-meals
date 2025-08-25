import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { API_URL } from "../../constants/api";
import { MealAPI } from "../../services/mealAPI";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";

const RecipeDetailScreen = () => {
  const { id: recipeId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const mealData = await MealAPI.getMealById(recipeId);
        if (mealData) {
          const transformedRecipe = MealAPI.transformMealData(mealData);
          setRecipe({
            ...transformedRecipe,
            youtubeUrl: mealData.strYoutube || null,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const checkSaved = async () => {
      try {
        const res = await fetch(`${API_URL}/favorites/${userId}`);
        const favorites = await res.json();
        setIsSaved(favorites.some((f) => f.recipeId === parseInt(recipeId)));
      } catch {}
    };

    loadRecipe();
    checkSaved();
  }, [recipeId, userId]);

  const getYoutubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleToggleSave = async () => {
    setIsSaving(true);
    try {
      if (isSaved) {
        await fetch(`${API_URL}/favorites/${userId}/${recipeId}`, {
          method: "DELETE",
        });
        setIsSaved(false);
      } else {
        await fetch(`${API_URL}/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            recipeId: parseInt(recipeId),
            title: recipe.title,
            image: recipe.image,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
          }),
        });
        setIsSaved(true);
      }
    } catch {
      Alert.alert("Error", "Something went wrong. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: recipe.image }}
          style={{
            width: "100%",
            height: 300,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={{
            position: "absolute",
            width: "100%",
            height: 300,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        />
        <View
          style={{
            position: "absolute",
            top: 40,
            left: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            width: Dimensions.get("window").width - 40,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "#FF69B4CC",
              padding: 8,
              borderRadius: 12,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleSave}
            disabled={isSaving}
            style={{
              backgroundColor: "#00BFFFCC",
              padding: 8,
              borderRadius: 12,
            }}
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{ position: "absolute", bottom: 20, left: 20, width: "70%" }}
        >
          <Text
            style={{ color: COLORS.white, fontSize: 26, fontWeight: "bold" }}
          >
            {recipe.title}
          </Text>
          {recipe.area && (
            <Text style={{ color: COLORS.white, marginTop: 4 }}>
              {recipe.area} Cuisine
            </Text>
          )}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          margin: 16,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            backgroundColor: "#FF69B4CC",
            borderRadius: 16,
            padding: 14,
            flex: 1,
            marginRight: 8,
          }}
        >
          <Ionicons name="time" size={20} color={COLORS.white} />
          <Text
            style={{ color: COLORS.white, fontWeight: "700", fontSize: 16 }}
          >
            {recipe.cookTime}
          </Text>
          <Text style={{ color: COLORS.white }}>Prep Time</Text>
        </View>
        <View
          style={{
            backgroundColor: "#00BFFFCC",
            borderRadius: 16,
            padding: 14,
            flex: 1,
            marginLeft: 8,
          }}
        >
          <Ionicons name="people" size={20} color={COLORS.white} />
          <Text
            style={{ color: COLORS.white, fontWeight: "700", fontSize: 16 }}
          >
            {recipe.servings}
          </Text>
          <Text style={{ color: COLORS.white }}>Servings</Text>
        </View>
      </View>

      <View style={recipeDetailStyles.sectionContainer}>
        <View style={recipeDetailStyles.sectionTitleRow}>
          <LinearGradient
            colors={["#9C27B0", "#673AB7"]}
            style={recipeDetailStyles.sectionIcon}
          >
            <Ionicons name="book" size={16} color={COLORS.white} />
          </LinearGradient>
          <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
          <View style={recipeDetailStyles.countBadge}>
            <Text style={recipeDetailStyles.countText}>
              {recipe.instructions.length}
            </Text>
          </View>
        </View>

        <View style={recipeDetailStyles.instructionsContainer}>
          {recipe.instructions.map((instruction, index) => (
            <View key={index} style={recipeDetailStyles.instructionCard}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "CC"]}
                style={recipeDetailStyles.stepIndicator}
              >
                <Text style={recipeDetailStyles.stepNumber}>{index + 1}</Text>
              </LinearGradient>
              <View style={recipeDetailStyles.instructionContent}>
                <Text style={recipeDetailStyles.instructionText}>
                  {instruction}
                </Text>
                <View style={recipeDetailStyles.instructionFooter}>
                  <Text style={recipeDetailStyles.stepLabel}>
                    Step {index + 1}
                  </Text>
                  <TouchableOpacity style={recipeDetailStyles.completeButton}>
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {recipe.youtubeUrl && (
        <View style={{ marginHorizontal: 16, marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
            Watch how to make it!
          </Text>
          <View style={{ height: 220, borderRadius: 20, overflow: "hidden" }}>
            <WebView
              style={{ flex: 1 }}
              source={{ uri: getYoutubeEmbedUrl(recipe.youtubeUrl) }}
              allowsFullscreenVideo
              mediaPlaybackRequiresUserAction={false}
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        onPress={handleToggleSave}
        disabled={isSaving}
        style={{ margin: 20, borderRadius: 24, overflow: "hidden" }}
      >
        <LinearGradient
          colors={["#FF69B4", "#00BFFF"]}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <Ionicons name="bookmark" size={20} color={COLORS.white} />
          <Text
            style={{
              color: COLORS.white,
              fontWeight: "700",
              fontSize: 18,
              marginLeft: 8,
            }}
          >
            {isSaved ? "Liked" : "Save Recipe"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RecipeDetailScreen;
