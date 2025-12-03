import { useClerk } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut();

      // Redirect to SignIn screen
      navigation.reset({
        index: 0,
        routes: [{ name: "SignInScreen" }],
      });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
  );
};
