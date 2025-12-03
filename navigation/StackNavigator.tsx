import SignInScreen from "@/screens/Auth/SignInScreen";
import SignUpScreen from "@/screens/Auth/SignUpScreen";
import Onboarding1 from "../screens/Onboarding/Onboarding1";
import Onboarding2 from "../screens/Onboarding/Onboarding2";
import Onboarding3 from "../screens/Onboarding/Onboarding3";
import TabsNavigator from "./TabsNavigator";

import DetectScreen from "@/screens/Home/DetectScreen";
import UserProfilePage from "@/screens/Home/UserProfilePage";
import { useAuth } from "@clerk/clerk-expo";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // wait for auth to load
  console.log("isSignedIn:", isSignedIn);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isSignedIn ? "MainTabs" : "Onboarding1"}
    >
      {/* ONBOARDING */}
      <Stack.Screen
        name="Onboarding1"
        component={Onboarding1}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Onboarding2"
        component={Onboarding2}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Onboarding3"
        component={Onboarding3}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* AUTH */}
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* HOME TABS */}
      <Stack.Screen name="MainTabs" component={TabsNavigator} />
      <Stack.Screen name="Profile" component={UserProfilePage} />
      <Stack.Screen name="Detect" component={DetectScreen} />
    </Stack.Navigator>
  );
}
