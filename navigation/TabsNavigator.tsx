import BiteAi from "@/screens/Home/BiteAi";
import HomeScreen from "@/screens/Home/Home";
import Weight from "@/screens/Home/Weight";
import Wellness from "@/screens/Home/wellness";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

const Tab = createBottomTabNavigator();

const tabs = [
  {
    name: "Home",
    component: HomeScreen,
    icon: "home",
  },
  {
    name: "Weight",
    component: Weight,
    icon: "barbell",
  },
  {
    name: "Wellness",
    component: Wellness,
    icon: "heart",
  },
  {
    name: "BiteAi",
    component: BiteAi,
    icon: "sparkles",
    label: "Bite AI",
  },
];

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#32CD32",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: "#FFFFFF",
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -4,
        },
      }}
    >
      {tabs.map(({ name, component, icon, label }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: label || name,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={`${icon}${focused ? "" : "-outline"}` as any}
                size={24}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}