import usuario from "@/data/usuario.json";
import { useRentalNotifications } from "@/hooks/useRentalNotifications";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function SuaCorrida() {
  // Mock de ID de corrida e duração
  // Em uma aplicação real, esses valores viriam de um contexto/estado global ou rota params
  const rentalId = "rental-001";
  const durationInMinutes = 30; // Exemplo: 30 minutos de aluguel

  // Callbacks para quando notificações são recebidas ou pressionadas
  const handleNotificationReceived = (notification: Notifications.Notification) => {
    console.log("Notificação recebida:", notification);
  };

  const handleNotificationPressed = (response: Notifications.NotificationResponse) => {
    console.log("Notificação pressionada:", response);
  };

  // Usar o hook para gerenciar notificações de aluguel
  useRentalNotifications(
    rentalId,
    durationInMinutes,
    handleNotificationReceived,
    handleNotificationPressed,
    // Pass user id so notification settings are applied per-user
    usuario.id
  );

  // No React Query hooks removed from this screen — keep only core logic

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-14">

      {/* Título e voltar */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl mr-4">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-semibold">Sua Corrida</Text>
      </View>

      {/* Caixas: Tempo e Custo Atual */}
      <View className="flex-row justify-between mb-4">
        
        <View className="bg-white rounded-2xl p-4 w-[48%] shadow">
          <Text className="text-gray-500 font-semibold">TEMPO</Text>
          <Text className="text-2xl font-bold mt-1">00:15:32</Text>
        </View>

        <View className="bg-white rounded-2xl p-4 w-[48%] shadow">
          <Text className="text-gray-500 font-semibold">CUSTO ATUAL</Text>
          <Text className="text-2xl font-bold mt-1">R$ 7,50</Text>
        </View>

      </View>

      {/* Bateria */}
      <View className="bg-white rounded-2xl p-4 mb-4 shadow">
        <Text className="text-gray-500 font-semibold">BATERIA</Text>

        <View className="flex-row items-center mt-1">
          <Text className="text-green-600 text-lg mr-2">🟩</Text>
          <Text className="text-2xl font-bold">82%</Text>
        </View>
      </View>

      {/* Imagem do Mapa */}
      <View className="h-64 rounded-2xl overflow-hidden mb-2 shadow">
        <Image
          source={require("../../../assets/images/mapa.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <Text className="text-center text-gray-600 mb-4">
        Patinete #ABCD-123
      </Text>

      {/* Removed React Query demo section */}

      {/* Botão de Encerrar */}
      <TouchableOpacity
        className="bg-blue-500 flex-row items-center justify-center py-4 rounded-full"
        onPress={() => router.push("/screens/corrida-em-andamento")}
      >
        <Text className="text-white text-lg font-semibold">
          ➡️  DESLIZE PARA ENCERRAR
        </Text>
      </TouchableOpacity>

    </View>
  );
}
