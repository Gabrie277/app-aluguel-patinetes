import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Importa os dados do JSON
import rawPatinetesData from '@/data/patinetes.json';
const patinetesData = rawPatinetesData as Patinete[];

// Componentes estilizados
const StyledView = View;
const StyledText = Text;
const StyledTouchableOpacity = TouchableOpacity;

type ImageKey = 'patinete1' | 'patinete2' | 'patinete3' | 'patinete4';

interface Patinete {
  id: number;
  bateria: number;
  localizacao: { lat: number; lng: number; };
  precoPorMinuto: number;
  status: string;
  imagem: ImageKey;
  modelo?: string;
  cor?: string;
}

// Mapeamento das imagens locais
const imagensPatinetes: Record<ImageKey, any> = {
  'patinete1': require('../../../assets/images/patinete1.jpg'),
  'patinete2': require('../../../assets/images/patinete2.png'),
  'patinete3': require('../../../assets/images/patinete3.jpg'),
  'patinete4': require('../../../assets/images/patinete4.jpg'),
};

const ListaPatinetes = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'disponivel' | 'reservado' | 'em_uso'>('todos');

  // Função para obter a cor da bateria
  const getBatteryColor = (batteryLevel: number) => {
    if (batteryLevel >= 70) return '#10B981';
    if (batteryLevel >= 30) return '#F59E0B';
    return '#EF4444';
  };

  // Função para obter informações do status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'disponivel':
        return { 
          color: '#10B981', 
          icon: 'checkmark-circle' as const,
          text: 'Disponível',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'reservado':
        return { 
          color: '#F59E0B', 
          icon: 'time' as const,
          text: 'Reservado',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'em_uso':
        return { 
          color: '#EF4444', 
          icon: 'flash' as const,
          text: 'Em Uso',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return { 
          color: '#6B7280', 
          icon: 'help-circle' as const,
          text: 'Indisponível',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  // Filtrar patinetes
  const filteredPatinetes = patinetesData.filter(patinete => {
    const matchesSearch = patinete.id.toString().includes(searchQuery) ||
                         patinete.modelo?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'todos' || patinete.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Navegar para detalhes
  const handlePatinetePress = (patinete: Patinete) => {
    router.push({
      pathname: "/screens/detalhes-patinete/[id]",
      params: { id: patinete.id }
    });
  };

  // Item da lista
  const renderPatineteItem = ({ item }: { item: Patinete }) => {
    const batteryColor = getBatteryColor(item.bateria);
    const statusInfo = getStatusInfo(item.status);

    return (
      <StyledTouchableOpacity 
        className={`bg-white rounded-2xl p-4 mb-3 shadow-lg border ${statusInfo.borderColor}`}
        onPress={() => handlePatinetePress(item)}
        activeOpacity={0.8}
      >
        <StyledView className="flex-row items-center">
          {/* Imagem do Patinete - TAMANHO PADRONIZADO COM CONTAINER FIXO */}
          <StyledView className="bg-gray-100 rounded-xl mr-4 overflow-hidden">
            <Image 
              source={imagensPatinetes[item.imagem]}
              className="w-20 h-20"
              resizeMode="contain"
              style={{ width: 80, height: 80 }}
            />
          </StyledView>

          {/* Informações Principais */}
          <StyledView className="flex-1">
            <StyledView className="flex-row items-center justify-between mb-2">
              <StyledText className="text-lg font-bold text-gray-800">
                Patinete #{item.id}
              </StyledText>
              <StyledView className={`px-2 py-1 rounded-full ${statusInfo.bgColor}`}>
                <StyledView className="flex-row items-center">
                  <Ionicons name={statusInfo.icon} size={12} color={statusInfo.color} />
                  <StyledText 
                    className="text-xs ml-1 font-medium"
                    style={{ color: statusInfo.color }}
                  >
                    {statusInfo.text}
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>

            <StyledText className="text-gray-600 text-sm mb-2">
              {item.modelo} • {item.cor}
            </StyledText>

            {/* Status e Preço */}
            <StyledView className="flex-row justify-between items-center">
              <StyledView className="flex-row items-center">
                <Ionicons name="battery-charging" size={16} color={batteryColor} />
                <StyledText 
                  className="text-sm ml-1 font-medium"
                  style={{ color: batteryColor }}
                >
                  {item.bateria}%
                </StyledText>
              </StyledView>

              <StyledView className="flex-row items-center">
                <MaterialIcons name="attach-money" size={16} color="#10B981" />
                <StyledText className="text-gray-800 font-bold ml-1">
                  R${item.precoPorMinuto.toFixed(2).replace('.', ',')}
                  <StyledText className="text-gray-600 text-xs">/min</StyledText>
                </StyledText>
              </StyledView>

              <StyledView className="flex-row items-center">
                <Ionicons name="location" size={14} color="#EF4444" />
                <StyledText className="text-gray-600 text-xs ml-1">
                  {Math.floor(Math.random() * 100) + 50}m
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledTouchableOpacity>
    );
  };

  // Header da lista
  const ListHeader = () => (
    <StyledView className="mb-6">
      <StyledView className="items-center mb-6">
        <StyledText className="text-3xl font-bold text-gray-800 mb-2">
          Patinetes Disponíveis
        </StyledText>
        <StyledText className="text-gray-600 text-center">
          Encontre o patinete perfeito para sua viagem
        </StyledText>
      </StyledView>

      {/* Barra de Pesquisa */}
      <StyledView className="mb-4">
        <StyledText className="text-gray-700 font-medium mb-3 text-lg">Buscar Patinete</StyledText>
        <StyledView className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 flex-row items-center">
          <Ionicons name="search" size={22} color="#3B82F6" />
          <TextInput
            placeholder="Digite o ID ou modelo do patinete..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 text-gray-800 text-base"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              className="p-1 bg-gray-100 rounded-full"
            >
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </StyledView>
      </StyledView>

      {/* Filtros de Status */}
      <StyledView className="mb-4">
        <StyledText className="text-gray-700 font-medium mb-3 text-lg">Filtrar por Status</StyledText>
        <StyledView className="flex-row flex-wrap">
          {[
            { key: 'todos', label: 'Todos', icon: 'grid', color: '#3B82F6' },
            { key: 'disponivel', label: 'Disponíveis', icon: 'checkmark-circle', color: '#10B981' },
            { key: 'reservado', label: 'Reservados', icon: 'time', color: '#F59E0B' },
            { key: 'em_uso', label: 'Em Uso', icon: 'flash', color: '#EF4444' },
          ].map((filter) => (
            <StyledTouchableOpacity
              key={filter.key}
              className={`flex-row items-center px-4 py-3 rounded-xl mr-3 mb-3 border-2 ${
                filterStatus === filter.key 
                  ? 'border-blue-500 bg-blue-50 shadow-sm' 
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => setFilterStatus(filter.key as any)}
            >
              <Ionicons 
                name={filter.icon as any} 
                size={18} 
                color={filterStatus === filter.key ? filter.color : '#6B7280'} 
              />
              <StyledText 
                className={`ml-2 font-semibold ${
                  filterStatus === filter.key ? 'text-blue-700' : 'text-gray-700'
                }`}
              >
                {filter.label}
              </StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledView>
      </StyledView>

      {/* Contador de resultados */}
      <StyledView className="flex-row justify-between items-center mb-3 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <StyledView>
          <StyledText className="text-blue-800 font-bold text-lg">
            {filteredPatinetes.length} {filteredPatinetes.length === 1 ? 'Patinete' : 'Patinetes'} 
          </StyledText>
          <StyledText className="text-blue-600 text-sm">
            {filteredPatinetes.length !== 1 ? 'encontrados' : 'encontrado'}
          </StyledText>
        </StyledView>
        <StyledView className="flex-row items-center bg-white px-3 py-2 rounded-lg border border-blue-100">
          <Ionicons name="navigate" size={16} color="#3B82F6" />
          <StyledText className="text-blue-600 font-medium ml-2">
            Mais próximo
          </StyledText>
          <Ionicons name="chevron-down" size={16} color="#3B82F6" className="ml-1" />
        </StyledView>
      </StyledView>
    </StyledView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-gray-100 px-5">
      <StatusBar barStyle="dark-content" backgroundColor="#eff6ff" />
      
      <FlatList
        data={filteredPatinetes}
        renderItem={renderPatineteItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <StyledView className="items-center justify-center py-16 bg-white rounded-2xl mx-2 mt-4 border border-gray-200">
            <Ionicons name="search-outline" size={80} color="#D1D5DB" />
            <StyledText className="text-gray-500 text-xl font-medium mt-6 mb-2">
              Nenhum patinete encontrado
            </StyledText>
            <StyledText className="text-gray-400 text-center text-base px-8">
              {searchQuery || filterStatus !== 'todos' 
                ? 'Tente ajustar os filtros ou a busca' 
                : 'Todos os patinetes estão disponíveis para reserva'}
            </StyledText>
            {(searchQuery || filterStatus !== 'todos') && (
              <StyledTouchableOpacity 
                className="mt-4 bg-blue-500 px-6 py-3 rounded-xl"
                onPress={() => {
                  setSearchQuery('');
                  setFilterStatus('todos');
                }}
              >
                <StyledText className="text-white font-semibold">
                  Limpar Filtros
                </StyledText>
              </StyledTouchableOpacity>
            )}
          </StyledView>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      {/* Botão Flutuante para Mapa */}
      <StyledTouchableOpacity 
        className="absolute bottom-8 right-8 bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-2xl shadow-blue-500/40 border-2 border-white"
        onPress={() => console.log('Abrir mapa')}
      >
        <Ionicons name="map" size={28} color="white" />
      </StyledTouchableOpacity>
    </SafeAreaView>
  );
};

export default ListaPatinetes;