export type RootStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  SignUpScreen: undefined;
  SignInScreen: undefined;
  MainTabs: undefined;
  Home: { addCalories?: number } | undefined;
  Detect: { base64: string; onAddCalories?: (calories: number) => void };
  profile: undefined;
};