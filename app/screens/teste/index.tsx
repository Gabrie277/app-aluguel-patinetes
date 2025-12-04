import { useQuery } from '@tanstack/react-query';
import { Link } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useActiveRental } from '../../../hooks/useActiveRental';
import { useCreateRental } from '../../../hooks/useCreateRental';
import '../../styles/global.css';

async function fetchHello(): Promise<{ message: string }> {
  // Simula uma chamada assíncrona
  return new Promise((resolve) => {
    setTimeout(() => resolve({ message: 'Olá do React Query' }), 500);
  });
}

export default function Teste() {
  const { data, isLoading, error } = useQuery(['hello'], fetchHello);
  // Usamos um userId de demonstração para testar os hooks de aluguel
  const demoUserId = 'demo-user';
  const activeRentalQuery = useActiveRental(demoUserId);
  const createRental = useCreateRental(demoUserId);

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-xl font-bold text-blue-500 mb-4">
        Tela inicial de teste do app!
      </Text>

      {isLoading && <ActivityIndicator size="small" color="#2563EB" />}
      {error && <Text className="text-red-500">Erro ao buscar dados</Text>}
      {data && (
        <Text className="text-lg text-gray-700 mb-6">{data.message}</Text>
      )}

      {/* Demo: criação de aluguel usando React Query */}
      <View className="mt-4 items-center">
        {createRental.isLoading ? (
          <ActivityIndicator size="small" color="#059669" />
        ) : (
          <TouchableOpacity
            onPress={() => createRental.mutate({ durationInMinutes: 5 })}
            className="mt-2 bg-emerald-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-bold text-lg">Criar aluguel (5m)</Text>
          </TouchableOpacity>
        )}

        {createRental.isError && (
          <Text className="text-red-500 mt-2">Erro ao criar aluguel</Text>
        )}

        {activeRentalQuery.data ? (
          <Text className="mt-3 text-gray-700">Aluguel ativo: {activeRentalQuery.data.rentalId}</Text>
        ) : (
          <Text className="mt-3 text-gray-500">Nenhum aluguel ativo</Text>
        )}
      </View>

      <Link href="/screens/detalhes-patinete" asChild>
        <TouchableOpacity className="mt-2 bg-blue-500 px-6 py-3 rounded-lg">
          <Text className="text-white font-bold text-lg">Ver Patinetes</Text>
        </TouchableOpacity>
      </Link>

      {/* Botão para abrir a tela de cadastro */}
      <Link href="/screens/cadastro" asChild>
        <TouchableOpacity className="mt-4 bg-green-500 px-6 py-3 rounded-lg">
          <Text className="text-white font-bold text-lg">Cadastrar</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
