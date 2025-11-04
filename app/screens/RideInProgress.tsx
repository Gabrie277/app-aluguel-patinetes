import { router } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export function FinishRideButton() {
  return (
    <TouchableOpacity
      onPress={() => router.push("/screens/RideSummary")}
      className="bg-blue-500 py-4 rounded-2xl w-full shadow-md active:opacity-90"
    >
      <Text className="text-white text-center font-semibold text-lg">
        Finalizar corrida
      </Text>
    </TouchableOpacity>
  );
}
