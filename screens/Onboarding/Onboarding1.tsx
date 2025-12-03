import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';



export default function Onboarding1() {
    const navigate = useNavigation();
  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-lime-400 to-lime-300">
      <View className="flex-1 items-center justify-center px-6 pb-6">
        {/* Logo */}
        <View className="mb-6">
            <Image source={require('../../assets/images/Onboard.png')} style={{ width: 450, height: 550, borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden'}} />
        </View>

        {/* Onboarding Text */}
        <View className="mt-8 items-center px-6">
          <Text className="text-2xl font-bold text-gray-800 text-center mb-3">
            Bite check - Personalized Tracking Made Easy
          </Text>
          <Text className="text-gray-600 text-center text-sm leading-5">
            Log your meals, track activities, steps, weight, BMI, and monitor hydration with tailored insights just for you.
          </Text>
        </View>

        {/* Progress Indicator */}
        <View className="flex-row space-x-2 mt-6">
          <View className="w-8 h-1 bg-lime-600 rounded-full" />
          <View className="w-8 h-1 bg-lime-200 rounded-full" />
          <View className="w-8 h-1 bg-lime-200 rounded-full" />
        </View>

        {/* Buttons */}
        <View className="flex-row space-x-4 mt-8 px-6 w-full max-w-sm gap-4">
          <TouchableOpacity className="flex-1 bg-white rounded-full py-4 border border-gray-200" onPress={() => navigate.navigate('SignInScreen')}>
            <Text className="text-center font-semibold text-gray-700">Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-lime-500 rounded-full py-4" onPress={() => navigate.navigate('Onboarding2')}>
            <Text className="text-center font-semibold text-white">Next</Text>
          </TouchableOpacity>
        </View>

        
      </View>
    </ScrollView>
  );
}