import { RootStackParamList } from "@/types/types";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  if (!user) return null;

  // 📸 Pick Profile Image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0].uri;
      await user.setProfileImage({ file: image });
      Alert.alert("Profile Updated", "Your photo has been updated!");
    }
  };

  // 💾 Save Basic Info
  const saveProfile = async () => {
    try {
      setIsSaving(true);

      await user.update({
        firstName,
        lastName,
      });

      Alert.alert("Saved", "Profile updated successfully!");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-3xl font-bold text-gray-800">Profile</Text>
          <Text className="text-gray-500 mt-1">
            Manage your account settings
          </Text>
        </View>

        {/* PROFILE IMAGE SECTION */}
        <View className="items-center py-8 bg-white mx-6 rounded-3xl shadow-sm">
          <View className="relative">
            <Image
              source={{ uri: user.imageUrl }}
              className="w-32 h-32 rounded-full border-4 border-gray-100"
            />
            <View className="absolute bottom-0 right-0 w-10 h-10 bg-gray-800 rounded-full items-center justify-center border-4 border-white">
              <Text className="text-white text-lg">📷</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={pickImage}
            className="mt-4 bg-gray-100 px-6 py-2.5 rounded-full"
          >
            <Text className="text-gray-800 font-semibold">Change Photo</Text>
          </TouchableOpacity>

          <Text className="text-gray-800 font-bold text-xl mt-4">
            {firstName} {lastName}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">{email}</Text>
        </View>

        {/* FORM SECTION */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Personal Information
          </Text>

          <View className="bg-white rounded-3xl shadow-sm p-5 space-y-5">
            <View>
              <Text className="text-gray-600 text-sm font-semibold mb-2">
                First Name
              </Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                className="bg-gray-50 p-4 rounded-2xl text-gray-800 text-base"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View>
              <Text className="text-gray-600 text-sm font-semibold mb-2">
                Last Name
              </Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                className="bg-gray-50 p-4 rounded-2xl text-gray-800 text-base"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View>
              <Text className="text-gray-600 text-sm font-semibold mb-2">
                Email Address
              </Text>
              <TextInput
                value={email}
                editable={false}
                className="bg-gray-100 p-4 rounded-2xl text-gray-500 text-base"
              />
              <Text className="text-gray-400 text-xs mt-1.5">
                Email cannot be changed directly
              </Text>
            </View>
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity
            onPress={saveProfile}
            disabled={isSaving}
            className={`p-4 rounded-2xl mt-6 shadow-sm ${
              isSaving ? "bg-orange-300" : "bg-orange-500"
            }`}
          >
            <Text className="text-center text-white font-bold text-base">
              {isSaving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* SECURITY SECTION */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">Security</Text>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Change Password",
                "Password change must be handled via your Clerk dashboard or custom flow."
              )
            }
            className="bg-white p-5 rounded-2xl shadow-sm flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Text className="text-lg">🔒</Text>
              </View>
              <View>
                <Text className="text-gray-800 font-semibold text-base">
                  Change Password
                </Text>
                <Text className="text-gray-500 text-xs mt-0.5">
                  Update your password
                </Text>
              </View>
            </View>
            <Text className="text-gray-400 text-xl">›</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT SECTION */}
        <View className="px-6 mt-8">
          <TouchableOpacity
            onPress={() => {
              signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: "SignInScreen" }],
              });
            }}
            className="bg-red-50 border-2 border-red-200 p-5 rounded-2xl flex-row items-center justify-center"
          >
            <Text className="text-lg mr-2">🚪</Text>
            <Text className="text-red-600 font-bold text-base">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
