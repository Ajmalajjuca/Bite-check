import { RootStackParamList } from "@/types/types";
import { useSignIn } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = NativeStackScreenProps<any>;

export default function SignInScreen() {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    setLoading(true);
    console.log("=== DEBUG INFO ===");
    console.log("isLoaded:", isLoaded);
    console.log("signIn exists:", !!signIn);
    console.log("signIn type:", typeof signIn);
    console.log("emailAddress:", emailAddress);
    console.log("password length:", password?.length);
    console.log("==================");

    if (!isLoaded || !signIn) {
      alert("Please wait, authentication is loading...");
      return;
    }

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      console.log("Sign in result status:", result.status);
      console.log("Created session ID:", result.createdSessionId);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      }
    } catch (err) {
      console.error("Full error object:", JSON.stringify(err, null, 2));
      const error = err as any;

      if (error?.errors?.length) {
        alert(error.errors[0].message);
      } else if (error?.message) {
        alert(error.message);
      } else {
        alert("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-lime-400 to-lime-300">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-12"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo/Header Area */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-white rounded-full items-center justify-center shadow-lg mb-4 overflow-hidden">
              <Image
                source={require("../../assets/images/icon.png")}
                style={{ width: 60, height: 60 }}
                resizeMode="contain"
              />
            </View>
            <Text className="text-4xl font-bold text-gray-800 mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-600 text-center text-base">
              Sign in to continue tracking your nutrition
            </Text>
          </View>

          {/* Sign In Form */}
          <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-6">
              Sign In
            </Text>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">
                Email Address
              </Text>
              <TextInput
                placeholder="your.email@example.com"
                value={emailAddress}
                onChangeText={setEmailAddress}
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-gray-50 rounded-2xl px-4 py-4 text-base text-gray-800 border-2 border-gray-100 focus:border-lime-500"
              />
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-700 font-semibold">Password</Text>
              </View>
              <TextInput
                placeholder="Enter your password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
                className="bg-gray-50 rounded-2xl px-4 py-4 text-base text-gray-800 border-2 border-gray-100 focus:border-lime-500"
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={onSignInPress}
              disabled={loading}
              className={`rounded-full py-4 shadow-md mb-4 ${
                loading ? "bg-lime-400" : "bg-lime-500 active:bg-lime-600"
              }`}
            >
              <Text className="text-center font-bold text-white text-lg">
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUpScreen")}
            className="py-4"
          >
            <Text className="text-center text-gray-700 text-base">
              Don't have an account?{" "}
              <Text className="text-lime-700 font-bold">Create Account</Text>
            </Text>
          </TouchableOpacity>

          {/* Extra spacing for keyboard */}
          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
