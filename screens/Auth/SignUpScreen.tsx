import { RootStackParamList } from "@/types/types";
import { useSignUp } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigation = useNavigation<NavigationProp>();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    setLoading(true);
    if (!isLoaded || !signUp) {
      alert("Clerk not loaded yet");
      return;
    }

    try {
      await signUp!.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err) {
      const error = err as any;
      console.log("Clerk Error:", JSON.stringify(err, null, 2));

      if (error?.errors?.length) {
        alert(error.errors[0].message);
      } else if (error?.message) {
        alert(error.message);
      } else {
        alert("Unexpected error occurred.");
      }
    }finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp!.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } else {
        console.log(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      const error = err as any;
      console.log("Clerk Error:", JSON.stringify(err, null, 2));

      if (error?.errors?.length) {
        alert(error.errors[0].message);
      } else if (error?.message) {
        alert(error.message);
      } else {
        alert("Unexpected error occurred.");
      }
    }
  };

  if (pendingVerification) {
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
            {/* Logo/Icon Area */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-white rounded-full items-center justify-center shadow-lg mb-4">
                <Text className="text-4xl">📧</Text>
              </View>
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                Verify Your Email
              </Text>
              <Text className="text-gray-600 text-center text-base">
                We've sent a verification code to {emailAddress}
              </Text>
            </View>

            {/* Verification Code Input */}
            <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
              <Text className="text-gray-700 font-semibold mb-3">
                Verification Code
              </Text>
              <TextInput
                value={code}
                placeholder="Enter 6-digit code"
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                className="bg-gray-50 rounded-2xl px-4 py-4 text-base text-gray-800 border-2 border-gray-100"
              />
            </View>

            {/* Verify Button */}
            <Pressable
              onPress={onVerifyPress}
              className="rounded-full py-4 mb-4 border-2 bg-lime-500 "
              style={({ pressed }) => ({
                backgroundColor: pressed ? "#65a30d" : "#84cc16",
              })}
            >
              <Text className="text-center font-bold  text-lg">
                Verify Email
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

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
              Bite Check
            </Text>
            <Text className="text-gray-600 text-center text-base">
              Your personalized nutrition tracker
            </Text>
          </View>

          {/* Sign Up Form */}
          <View className="bg-white rounded-3xl p-6 shadow-lg mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-6">
              Create Account
            </Text>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">
                Email Address
              </Text>
              <TextInput
                value={emailAddress}
                placeholder="your.email@example.com"
                onChangeText={setEmailAddress}
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-gray-50 rounded-2xl px-4 py-4 text-base text-gray-800 border-2 border-gray-100 focus:border-lime-500"
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">Password</Text>
              <TextInput
                value={password}
                placeholder="Create a strong password"
                secureTextEntry
                onChangeText={setPassword}
                className="bg-gray-50 rounded-2xl px-4 py-4 text-base text-gray-800 border-2 border-gray-100 focus:border-lime-500"
              />
              <Text className="text-gray-500 text-xs mt-2">
                Must be at least 8 characters
              </Text>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={onSignUpPress}
              disabled={loading}
              className={`rounded-full py-4 shadow-md mb-4 ${
                loading ? "bg-lime-400" : "bg-lime-500 active:bg-lime-600"
              }`}
            >
              <Text className="text-center font-bold text-white text-lg">
                {loading ? "Signing Up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Terms Text */}
            <Text className="text-gray-500 text-xs text-center">
              By signing up, you agree to our{" "}
              <Text className="text-lime-700 font-semibold">
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text className="text-lime-700 font-semibold">
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Sign In Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate("SignInScreen")}
            className="py-4"
          >
            <Text className="text-center text-gray-700 text-base">
              Already have an account?{" "}
              <Text className="text-lime-700 font-bold">Sign In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
