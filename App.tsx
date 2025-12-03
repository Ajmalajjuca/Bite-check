import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { JSX } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";
import StackNavigator from "./navigation/StackNavigator";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... to your .env file"
  );
}

export default function App(): JSX.Element {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <NavigationContainer>
          <SafeAreaView style={{ flex: 1 }}>
            <StackNavigator />
            <StatusBar style="auto" />
          </SafeAreaView>
        </NavigationContainer>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
