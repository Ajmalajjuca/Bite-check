import { useUser } from "@clerk/clerk-expo";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import WeekCalendar from "@/components/WeekCalendar";
import { db } from "@/firebase";
import { RootStackParamList } from "@/types/types";
import { doc, getDoc } from "firebase/firestore";
import animation from "../../assets/images/animatin/animation.json";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CALORIES_GOAL = 2088;
const todayKey = new Date().toISOString().split("T")[0];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { user } = useUser();

  if (!user) return null;

  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const [caloriesEaten, setCaloriesEaten] = useState(0);

  // 🟢 NEW: Function to load calories from Firebase
  const loadCalories = useCallback(async () => {
    try {
      const ref = doc(db, "calories", `${user.id}_${todayKey}`);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCaloriesEaten(snap.data().calories || 0);
      } else {
        setCaloriesEaten(0);
      }
    } catch (err: any) {
      console.log("Error loading calories:", err.message);

      if (err.code === "unavailable") {
        console.log("Offline mode - using cached data");
      }
    }
  }, [user.id]);

  // 🟢 UPDATED: Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCalories();
    }, [loadCalories])
  );

  // 🟢 UPDATED: Also reload when shouldReload param is passed
  useEffect(() => {
    if (route.params?.shouldReload) {
      loadCalories();
      // Clear the param
      navigation.setParams({ shouldReload: undefined });
    }
  }, [route.params?.shouldReload, loadCalories]);

  // Handle incoming calories from DetectScreen (legacy support)
  useEffect(() => {
    if (route.params?.addCalories) {
      const newCalories = route.params.addCalories;
      setCaloriesEaten((prev) => prev + newCalories);

      navigation.setParams({ addCalories: undefined });

      Alert.alert("Success", `Added ${newCalories} calories!`);
    }
  }, [route.params?.addCalories]);

  const { month, year, weekday } = useMemo(() => {
    const today = new Date();
    return {
      month: today.toLocaleString("en-US", { month: "long" }),
      year: today.getFullYear().toString().slice(-2),
      weekday: today.toLocaleString("en-US", { weekday: "long" }),
    };
  }, []);

  const takePhoto = useCallback(async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
        skipProcessing: false,
      });

      setShowCamera(false);
      navigation.navigate("Detect", {
        base64: photo.base64!,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.");
      console.error(error);
    }
  }, [navigation]);

  if (!permission) return <LoadingView />;
  if (!permission.granted)
    return <CameraPermissionView onGrant={requestPermission} />;
  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
          <View>
            <Text className="text-2xl font-bold text-gray-800">
              {month} '{year}
            </Text>
            <Text className="text-gray-500 text-base">{weekday}</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            className="w-14 h-14 bg-white rounded-full overflow-hidden shadow-sm"
          >
            <Image
              source={{ uri: user.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        <WeekCalendar />

        <View className="items-center my-6">
          <LottieView
            source={animation}
            autoPlay
            loop
            style={{ width: 280, height: 280 }}
            speed={0.9}
          />
        </View>

        <View className="items-center px-6">
          <View className="flex-row items-end">
            <Text className="text-7xl font-extrabold text-gray-900">
              {caloriesEaten}
            </Text>
            <Text className="text-4xl text-gray-400 font-light ml-2">
              /{CALORIES_GOAL}
            </Text>
          </View>
          <Text className="text-gray-600 text-lg font-medium mt-3 tracking-wider">
            CALORIES EATEN TODAY
          </Text>
        </View>
      </ScrollView>

      {/* FAB */}
      <View className="absolute bottom-24 right-6 z-10">
        <TouchableOpacity
          onPress={() => {
            setShowCamera(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
          }}
          className="w-16 h-16 bg-lime-600 rounded-full items-center justify-center shadow-2xl"
        >
          <Text className="text-white text-4xl font-light -mt-1">+</Text>
        </TouchableOpacity>
      </View>

      {/* Camera Modal */}
      {showCamera && (
        <View className="absolute inset-0 bg-black z-50">
          <CameraView ref={cameraRef} facing="back" style={{ flex: 1 }} />

          <View className="absolute bottom-10 left-0 right-0 flex-row justify-center">
            <TouchableOpacity
              onPress={() => {
                takePhoto();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              className="w-20 h-20 bg-white rounded-full border-8 border-gray-800"
            />
          </View>

          <TouchableOpacity
            onPress={() => setShowCamera(false)}
            className="absolute top-12 right-6 bg-white/90 px-4 py-2 rounded-full"
          >
            <Text className="font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// Helper Components
const LoadingView = () => (
  <View className="flex-1 bg-gray-50 items-center justify-center">
    <Text className="text-gray-600">Loading camera...</Text>
  </View>
);

const CameraPermissionView = ({ onGrant }: { onGrant: () => void }) => (
  <View className="flex-1 bg-gray-50 items-center justify-center px-8">
    <Text className="text-xl text-center text-gray-700 mb-8">
      We need camera access to scan your food
    </Text>
    <TouchableOpacity
      onPress={onGrant}
      className="bg-lime-600 px-8 py-4 rounded-full"
    >
      <Text className="text-white font-bold text-lg">Grant Permission</Text>
    </TouchableOpacity>
  </View>
);
