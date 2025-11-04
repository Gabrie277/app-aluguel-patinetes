import { View, Text, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

export default function RideSummary() {
  const router = useRouter();
  const [rating, setRating] = useState(4);

  const totalStars = 5;

  return (
    <View className="flex-1 bg-gray-100 justify-end p-4">
      <Stack.Screen options={{ title: "Sua Corrida" }} />

      <View className="bg-white rounded-2xl p-6 shadow-lg">
        <Text className="text-center text-xl font-semibold mb-6">Sua Corrida</Text>

        <View className="flex-row justify-between mb-6">
          <View className="bg-gray-100 rounded-xl p-4 items-center w-1/3">
            <FontAwesome name="road" size={24} className="text-blue-500" />
            <Text className="text-sm text-gray-500 mt-2">Distância</Text>
            <Text className="text-lg font-semibold">5.2 km</Text>
          </View>

          <View className="bg-gray-100 rounded-xl p-4 items-center w-1/3 mx-2">
            <FontAwesome name="clock-o" size={24} className="text-blue-500" />
            <Text className="text-sm text-gray-500 mt-2">Duração</Text>
            <Text className="text-lg font-semibold">15 min</Text>
          </View>

          <View className="bg-gray-100 rounded-xl p-4 items-center w-1/3">
            <FontAwesome name="money" size={24} className="text-blue-500" />
            <Text className="text-sm text-gray-500 mt-2">Custo</Text>
            <Text className="text-lg font-semibold">R$ 8,50</Text>
          </View>
        </View>

        <Text className="text-center text-base font-medium mb-1">Como foi sua corrida?</Text>
        <Text className="text-center text-sm text-gray-400 mb-4">(opcional)</Text>

        <View className="flex-row justify-center mb-6">
          {[...Array(totalStars)].map((_, index) => {
            const starIndex = index + 1;
            return (
              <TouchableOpacity key={index} onPress={() => setRating(starIndex)}>
                <FontAwesome
                  name="star"
                  size={28}
                  color={starIndex <= rating ? "#FFD700" : "#D1D5DB"}
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          className="bg-blue-500 rounded-xl py-4"
          onPress={() => router.push("/")}
        >
          <Text className="text-center text-white font-semibold text-base">Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
