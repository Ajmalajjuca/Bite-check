import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { db } from "@/firebase";
import { RootStackParamList } from "@/types/types";
import { useUser } from "@clerk/clerk-expo";
import * as Haptics from "expo-haptics";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import LottieView from "lottie-react-native";
import scanner from "../../assets/images/animatin/Scanner.json";



type DetectScreenProps = {
  route: { params: { base64: string } };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const todayKey = new Date().toISOString().split("T")[0];

export default function DetectScreen({ route }: DetectScreenProps) {
  const { base64 } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const [result, setResult] = useState<string | null>(null);
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [foodName, setFoodName] = useState<string>("");
  const { user } = useUser();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    detectFood();
  }, []);

  const hapticInterval = useRef<number | null>(null);

const startHapticPulse = () => {
  if (hapticInterval.current) return; // prevent duplicate loops

  hapticInterval.current = setInterval(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  }, 1400); // soft pulse rhythm
};

const stopHapticPulse = () => {
  if (hapticInterval.current) {
    clearInterval(hapticInterval.current);
    hapticInterval.current = null;
  }
};

useEffect(() => {
  startHapticPulse();

  return () => {
    stopHapticPulse(); // cleanup when leaving the screen
  };
}, []);

useEffect(() => {
  if (result) {
    stopHapticPulse();
  }
}, [result]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Smooth fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const detectFood = async () => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;
      if (!apiKey) throw new Error("Gemini API key missing");

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64,
                  },
                },
                {
                  text: `
                    You are a precise food nutrition analyzer.
                    Analyze the food in this image and respond in this exact format:

                    Food: [Name of dish or items]
                    Portion estimate: [e.g. medium bowl, 1 slice, etc.]
                    Calories: [number] kcal
                    Protein: [number]g
                    Carbs: [number]g
                    Fat: [number]g

                    If multiple items, list them separately.
                    Be accurate and realistic.
                  `,
                },
              ],
            },
          ],
        }
      );

      const text =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No result from AI.";

      setResult(text);

      // Extract nutrition info
      const calorieMatch = text.match(/Calories:\s*(\d+)/i);
      const proteinMatch = text.match(/Protein:\s*(\d+)/i);
      const carbsMatch = text.match(/Carbs:\s*(\d+)/i);
      const fatMatch = text.match(/Fat:\s*(\d+)/i);
      const foodMatch = text.match(/Food:\s*([^\n]+)/i);

      if (calorieMatch) setCalories(parseInt(calorieMatch[1], 10));
      if (proteinMatch) setProtein(parseInt(proteinMatch[1], 10));
      if (carbsMatch) setCarbs(parseInt(carbsMatch[1], 10));
      if (fatMatch) setFat(parseInt(fatMatch[1], 10));
      if (foodMatch) setFoodName(foodMatch[1].trim());
    } catch (err: any) {
      console.error("Gemini API Error:", err.response?.data || err.message);
      setResult("Error: Failed to analyze food. Please try again.");
    }
  };

  const handleAdd = async () => {
    if (!user || calories <= 0) {
      Alert.alert("Error", "Cannot add calories.");
      return;
    }

    setLoading(true);
    try {
      const ref = doc(db, "calories", `${user.id}_${todayKey}`);

      const snap = await getDoc(ref);
      const currentCalories = snap.exists() ? snap.data().calories || 0 : 0;

      const newTotal = currentCalories + calories;

      await setDoc(ref, {
        calories: newTotal,
        date: todayKey,
        userId: user.id,
        updatedAt: serverTimestamp(),
      });

      Alert.alert("Success!", `Added ${calories} calories`);

      navigation.navigate("MainTabs", { shouldReload: true });
    } catch (err: any) {
      console.error("Save error:", err.message);

      if (err.code === "unavailable") {
        Alert.alert(
          "Offline",
          "You're offline. Please check your internet connection and try again."
        );
      } else if (err.code === "permission-denied") {
        Alert.alert(
          "Permission Denied",
          "You don't have permission to save data. Please check your Firebase security rules."
        );
      } else {
        Alert.alert("Error", "Failed to save calories. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!result) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Animated.View style={{ opacity: fadeAnim }}>
          <LottieView
            source={scanner}
            autoPlay
            loop
            style={{ width: 300, height: 300 }}
            speed={1.1}
          />
        </Animated.View>
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="items-center mt-2"
        >
          <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Scanning…
          </Text>

          <Text className="text-gray-500 text-base mt-1">
            Identifying your meal, please wait
          </Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <TouchableOpacity
          onPress={handleCancel}
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-800">
          Nutrition Analysis
        </Text>

        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Food Name Card */}
        {foodName && (
          <View className="bg-white rounded-3xl shadow-sm p-6 mt-4">
            <Text className="text-gray-500 text-sm font-medium mb-1">
              Detected Food
            </Text>
            <Text className="text-2xl font-bold text-gray-800">{foodName}</Text>
          </View>
        )}

        {/* Main Calorie Display */}
        <View className="items-center my-8">
          <View className="bg-gradient-to-br from-lime-400 to-lime-600 rounded-full w-56 h-56 items-center justify-center shadow-2xl">
            <Text className="text-6xl font-extrabold text-black">
              {calories}
            </Text>
            <Text className="text-black text-lg font-medium mt-2 tracking-wider">
              CALORIES
            </Text>
          </View>
        </View>

        {/* Macros Grid */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          {/* Protein */}
          <View className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="fitness" size={20} color="#3b82f6" />
              </View>
              <Text className="text-gray-500 text-sm font-medium">Protein</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-800">{protein}g</Text>
          </View>

          {/* Carbs */}
          <View className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="nutrition" size={20} color="#f59e0b" />
              </View>
              <Text className="text-gray-500 text-sm font-medium">Carbs</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-800">{carbs}g</Text>
          </View>

          {/* Fat */}
          <View className="flex-1 min-w-[45%] bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row items-center mb-2">
              <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="water" size={20} color="#ef4444" />
              </View>
              <Text className="text-gray-500 text-sm font-medium">Fat</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-800">{fat}g</Text>
          </View>
        </View>

        {/* Full Details Card */}
        <View className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Full Analysis
          </Text>
          <Text className="text-base text-gray-700 leading-7">{result}</Text>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-2xl">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleCancel}
            className="flex-1 bg-gray-100 py-4 rounded-2xl"
            disabled={loading}
          >
            <Text className="text-center text-gray-800 font-bold text-base">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAdd}
            className="flex-[2] bg-lime-600 py-4 rounded-2xl shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name="add-circle"
                  size={20}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-center text-white font-bold text-base">
                  Add to Today
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
