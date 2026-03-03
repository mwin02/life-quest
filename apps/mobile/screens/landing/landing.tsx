import GoldButton from "@/components/GoldButton";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function LandingScreen() {
  const router = useRouter();

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <View>
      <GoldButton title="Register" onPress={handleRegister} />
    </View>
  );
}
