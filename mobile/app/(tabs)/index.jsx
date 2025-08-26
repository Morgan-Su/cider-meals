import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CategoryFilter from "../../components/CategoryFilter";
import RecipeCard from "../../components/RecipeCard";
import { MealAPI } from "../../services/mealAPI";

const COLORS = {
  bg: "#F3F0FF",
  primary: ["#b73786ff", "#6E3BFF"],
  text: "#1E1E2F",
  neon: "#FF6EC7",
  accent: "#6E3BFF",
  textLight: "#555",
};

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [apiCategories, randomMeals, featuredMeal] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(3),
        MealAPI.getRandomMeal(),
      ]);

      const transformedCategories = apiCategories.map((cat, index) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));
      setCategories(transformedCategories);
      if (!selectedCategory) setSelectedCategory(transformedCategories[0].name);

      const transformedMeals = randomMeals
        .map((meal, index) => {
          const transformed = MealAPI.transformMealData(meal);
          if (!transformed) return null;
          return transformed;
        })
        .filter((meal) => meal !== null);
      setRecipes(transformedMeals);
      const transformedFeatured = MealAPI.transformMealData(featuredMeal);
      setFeaturedRecipe(transformedFeatured);
    } catch (error) {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (category) => {
    try {
      const meals = await MealAPI.filterByCategory(category);
      const transformedMeals = meals
        .map((meal, index) => {
          const transformed = MealAPI.transformMealData(meal);
          if (!transformed) return null;
          return transformed;
        })
        .filter((meal) => meal !== null);
      setRecipes(transformedMeals);
    } catch {
      setRecipes([]);
    }
  };

  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary[0]}
          />
        }
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "900",
              color: COLORS.primary[0],
            }}
          >
            Cider Meals
          </Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Ionicons
              name="log-out-outline"
              size={28}
              color={COLORS.primary[1]}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginHorizontal: 16,
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: COLORS.primary[0],
            padding: 24,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: COLORS.bg,
              textAlign: "center",
            }}
          >
            Welcome back to Cider Meals 🍷
          </Text>
        </View>

        {featuredRecipe && (
          <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
            >
              <Image
                source={{ uri: featuredRecipe.image }}
                style={{ width: "100%", height: 200, borderRadius: 20 }}
                contentFit="cover"
                transition={500}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "rgba(110,59,255,0.6)",
                  padding: 12,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                  numberOfLines={1}
                >
                  {featuredRecipe.title}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        <View style={{ marginHorizontal: 16, marginTop: 24 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "900",
              color: COLORS.primary[1],
              marginBottom: 12,
            }}
          >
            Browse Recipes
          </Text>
          {recipes.length > 0 ? (
            <FlatList
              data={recipes}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              keyExtractor={(item, index) => `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}
              scrollEnabled={false}
              numColumns={1}
            />
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Ionicons
                name="restaurant-outline"
                size={64}
                color={COLORS.textLight}
              />
              <Text
                style={{ fontSize: 18, color: COLORS.textLight, marginTop: 12 }}
              >
                No recipes found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
