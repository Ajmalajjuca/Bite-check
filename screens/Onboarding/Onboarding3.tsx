import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';



export default function Onboarding3() {
    const navigate = useNavigation();
  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-lime-400 to-lime-300">
      <View className="flex-1 items-center justify-center px-6 pb-6">
        {/* Logo */}
        <View className="mb-6">
            <Image source={require('../../assets/images/Onboard3.png')} style={{ width: 450, height: 550, borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden'}} />
        </View>

        {/* Onboarding Text */}
        <View className="mt-8 items-center px-6">
          <Text className="text-2xl font-bold text-gray-800 text-center mb-3">
            Empower Your Health Journey with Bite Check
          </Text>
          <Text className="text-gray-600 text-center text-sm leading-5">
            Experience personalized nutrition insights, activity tracking, and hydration monitoring like never before. Join us on this exciting health journey with Bite Check.          </Text>
        </View>

        {/* Progress Indicator */}
        <View className="flex-row space-x-2 mt-6">
          <View className="w-8 h-1 bg-lime-200 rounded-full" />
          <View className="w-8 h-1 bg-lime-200 rounded-full" />
          <View className="w-8 h-1 bg-lime-600 rounded-full" />
        </View>

        {/* Buttons */}
        <View className="flex-row space-x-4 mt-8 px-6 w-full max-w-sm gap-4">
          <TouchableOpacity className="flex-1 bg-lime-500 rounded-full py-4" onPress={() => navigate.navigate('SignInScreen')}>
            <Text className="text-center font-semibold text-white">Let's Get Started</Text>
          </TouchableOpacity>
        </View>

        
      </View>
    </ScrollView>
  );
}