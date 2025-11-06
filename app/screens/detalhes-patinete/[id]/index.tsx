import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import patinetesData from '@/data/patinetes.json';

const StyledView = View;
const StyledText = Text;
const StyledTouchableOpacity = TouchableOpacity;

type ImageKey = 'patinete1' | 'patinete2' | 'patinete3' | 'patinete4';

interface Patinete {
  id: number;
  bateria: number;
  localizacao: { lat: number; lng: number };
  precoPorMinuto: number;
  status: string;
  imagem: ImageKey;
  modelo?: string;
  cor?: string;
}

const imagensPatinetes: Record<ImageKey, any> = {
  'patinete1': require('../../../../assets/images/patinete1.jpg'),
  'patinete2': require('../../../../assets/images/patinete2.png'),
  'patinete3': require('../../../../assets/images/patinete3.jpg'),
  'patinete4': require('../../../../assets/images/patinete4.jpg'),
};

const DetalhePatineteId = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;
  const [showReservaSuccess, setShowReservaSuccess] = useState(false);

  const patineteData =
    patinetesData.find(p => p.id === parseInt(id as string)) || patinetesData[0];

  const getBatteryColor = (batteryLevel: number) => {
    if (batteryLevel >= 70) return '#10B981';
    if (batteryLevel >= 30) return '#F59E0B';
    return '#EF4444';
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'disponivel':
        return { color: '#10B981', icon: 'checkmark-circle' as const, text: 'Disponível' };
      case 'reservado':
        return { color: '#F59E0B', icon: 'time' as const, text: 'Reservado' };
      case 'em_uso':
        return { color: '#EF4444', icon: 'flash' as const, text: 'Em Uso' };
      default:
        return { color: '#6B7280', icon: 'help-circle' as const, text: 'Indisponível' };
    }
  };

  const handleReserve = () => {
    console.log('Patinete reservado!', `Patinete #${patineteData.id}`);
    
    // Mostra mensagem de sucesso
    setShowReservaSuccess(true);
    
    // Após 2 segundos, navega para a página de teste
    setTimeout(() => {
      setShowReservaSuccess(false);
      router.push('/screens/teste');
    }, 2000);
  };

  const handleVoltar = () => {
    router.back();
  };

  const InfoCard = ({
    title,
    value,
    subtitle,
    icon,
  }: {
    title: string;
    value: number;
    subtitle: string;
    icon: React.ReactNode;
  }) => (
    <StyledView className="bg-white rounded-xl p-5 items-center w-48 shadow-lg border border-gray-100">
      {icon}
      <StyledText className="text-2xl font-bold text-gray-800 mb-1 mt-2">{value}</StyledText>
      <StyledText className="text-sm text-gray-600 mb-1 font-medium">{title}</StyledText>
      {subtitle && <StyledText className="text-xs text-gray-500">{subtitle}</StyledText>}
    </StyledView>
  );

  const batteryColor = getBatteryColor(patineteData.bateria);
  const statusInfo = getStatusInfo(patineteData.status);

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-gray-50 px-5">
      <StatusBar barStyle="dark-content" backgroundColor="#f0f9ff" />

      {/* Overlay de sucesso da reserva */}
      {showReservaSuccess && (
        <StyledView className="absolute inset-0 bg-black bg-opacity-50 z-50 items-center justify-center">
          <StyledView className="bg-white rounded-2xl p-8 mx-6 items-center shadow-2xl">
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            <StyledText className="text-2xl font-bold text-gray-800 mt-4 text-center">
              Reserva Confirmada!
            </StyledText>
            <StyledText className="text-gray-600 text-center mt-2">
              Patinete #{patineteData.id} reservado com sucesso
            </StyledText>
            <StyledText className="text-blue-500 text-sm mt-4">
              Redirecionando para a página de teste...
            </StyledText>
          </StyledView>
        </StyledView>
      )}

      {/* ✅ ScrollView adicionado para permitir rolagem */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Botão Voltar */}
        <StyledTouchableOpacity onPress={handleVoltar} className="flex-row items-center mt-4 mb-2">
          <Ionicons name="arrow-back" size={24} color="#3B82F6" />
          <StyledText className="text-blue-500 ml-2 font-medium">Voltar</StyledText>
        </StyledTouchableOpacity>

        {/* Header com IMAGEM LOCAL do assets - TAMANHO PADRONIZADO */}
        <StyledView className="items-center mt-2 mb-6">
          <StyledView className="bg-white rounded-2xl p-3 shadow-lg mb-4 border border-gray-100">
            <Image
              source={imagensPatinetes[patineteData.imagem as ImageKey]}
              className="w-32 h-32 rounded-xl"
              resizeMode="contain"
              style={{ width: 128, height: 128 }}
            />
          </StyledView>
          <StyledText className="text-2xl font-bold text-gray-800">
            Patinete #{patineteData.id}
          </StyledText>
          <StyledText className="text-gray-600 text-sm mt-1">
            {patineteData.modelo} • {patineteData.cor}
          </StyledText>
          <StyledView className="flex-row items-center mt-1">
            <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} />
            <StyledText className="text-sm ml-1 font-medium" style={{ color: statusInfo.color }}>
              {statusInfo.text}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Battery Section */}
        <StyledView className="bg-white rounded-2xl p-6 mb-5 shadow-lg border border-gray-100">
          <StyledView className="flex-row items-center mb-4">
            <Ionicons name="battery-charging" size={24} color={batteryColor} />
            <StyledText className="text-base text-gray-600 ml-2 font-medium">Bateria</StyledText>
          </StyledView>
          <StyledView className="flex-row justify-between items-center mb-3">
            <StyledText className="text-2xl font-bold" style={{ color: batteryColor }}>
              {patineteData.bateria}%
            </StyledText>
            <StyledText className="text-sm text-gray-500">
              {patineteData.bateria >= 70
                ? 'Carregado'
                : patineteData.bateria >= 30
                ? 'Bateria média'
                : 'Bateria baixa'}
            </StyledText>
          </StyledView>
          <StyledView className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <StyledView
              className="h-full rounded-full"
              style={{ width: `${patineteData.bateria}%`, backgroundColor: batteryColor }}
            />
          </StyledView>
        </StyledView>

        {/* Cost Section */}
        <StyledView className="bg-white rounded-2xl p-6 mb-5 shadow-lg border border-gray-100">
          <StyledView className="flex-row items-center mb-4">
            <MaterialIcons name="attach-money" size={24} color="#F59E0B" />
            <StyledText className="text-base text-gray-600 ml-2 font-medium">Custo</StyledText>
          </StyledView>
          <StyledView className="items-center">
            <StyledText className="text-3xl font-bold text-gray-800 mb-1">
              R${patineteData.precoPorMinuto.toFixed(2).replace('.', ',')}
              <StyledText className="text-lg text-gray-600">/min</StyledText>
            </StyledText>
            <StyledText className="text-sm text-gray-500">Tarifa por minuto</StyledText>
          </StyledView>
        </StyledView>

        {/* Info Grid */}
        <StyledView className="flex-row justify-between mb-8">
          <InfoCard
            title="Autonomia"
            value={Math.floor(patineteData.bateria * 0.2)}
            subtitle="quilômetros restantes"
            icon={<MaterialCommunityIcons name="map-marker-distance" size={28} color="#8B5CF6" />}
          />
          <InfoCard
            title="Distância"
            value={50}
            subtitle="metros de você"
            icon={<Ionicons name="location" size={28} color="#EF4444" />}
          />
        </StyledView>

        {/* Additional Info */}
        <StyledView className="bg-white rounded-2xl p-5 mb-6 shadow-lg border border-gray-100">
          <StyledView className="flex-row items-center justify-between">
            <StyledView className="flex-row items-center">
              <MaterialIcons name="speed" size={20} color="#6B7280" />
              <StyledText className="text-gray-600 ml-2 text-sm">
                Velocidade máxima: 25 km/h
              </StyledText>
            </StyledView>
            <StyledView className="flex-row items-center">
              <MaterialCommunityIcons name="weight" size={20} color="#6B7280" />
              <StyledText className="text-gray-600 ml-2 text-sm">Peso: 15kg</StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Reserve Button */}
        {patineteData.status === 'disponivel' && (
          <StyledTouchableOpacity
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl py-5 items-center shadow-2xl shadow-blue-500/40 mb-6"
            onPress={handleReserve}
            activeOpacity={0.9}
            disabled={showReservaSuccess}
          >
            <StyledView className="flex-row items-center">
              <Ionicons name="lock-closed" size={20} color="white" />
              <StyledText className="text-white text-lg font-bold ml-2">
                Reservar Patinete
              </StyledText>
            </StyledView>
            <StyledText className="text-blue-100 text-sm mt-1">Reserva por 15 minutos</StyledText>
          </StyledTouchableOpacity>
        )}

        {patineteData.status !== 'disponivel' && (
          <StyledView className="bg-yellow-50 rounded-2xl p-5 items-center border border-yellow-200 mb-6">
            <Ionicons name="information-circle" size={24} color="#F59E0B" />
            <StyledText className="text-yellow-800 font-medium mt-2 text-center">
              Este patinete não está disponível para reserva no momento
            </StyledText>
            <StyledText className="text-yellow-600 text-sm mt-1 text-center">
              Status: {statusInfo.text}
            </StyledText>
          </StyledView>
        )}

        {/* Safety Info */}
        <StyledView className="items-center mb-8">
          <StyledView className="flex-row items-center">
            <Ionicons name="shield-checkmark" size={16} color="#10B981" />
            <StyledText className="text-gray-500 text-xs ml-1">
              Patinete verificado e seguro para uso
            </StyledText>
          </StyledView>
        </StyledView>
      </ScrollView>
      {/* ✅ Fim do ScrollView */}
    </SafeAreaView>
  );
};

export default DetalhePatineteId;