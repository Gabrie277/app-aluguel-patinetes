import usuario from "@/data/usuario.json";
import { getNotificationSettings, saveNotificationSettings } from "@/services/notificationSettingsService";
import { NotificationSettings } from "@/types/notifications";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

export default function ConfiguracoesNotificacoes() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>({
    enableNotifications: true,
    enableSoundNotifications: true,
    enableVibration: true,
  });
  const [loading, setLoading] = useState(true);

  // Carregar configurações salvas do usuário
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loaded = await getNotificationSettings(usuario.id);
        setSettings(loaded);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Salvar configurações sempre que mudam
  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      const success = await saveNotificationSettings(newSettings, usuario.id);
      if (success) {
        setSettings(newSettings);
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  const handleToggleNotifications = () => {
    const newSettings = {
      ...settings,
      enableNotifications: !settings.enableNotifications,
    };
    saveSettings(newSettings);
  };

  const handleToggleSoundNotifications = () => {
    const newSettings = {
      ...settings,
      enableSoundNotifications: !settings.enableSoundNotifications,
    };
    saveSettings(newSettings);
  };

  const handleToggleVibration = () => {
    const newSettings = {
      ...settings,
      enableVibration: !settings.enableVibration,
    };
    saveSettings(newSettings);
  };

  const handleVoltar = () => {
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Cabeçalho */}
      <View className="p-6">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={handleVoltar}>
            <ArrowLeft color="#3B82F6" size={26} />
          </TouchableOpacity>
          <View className="flex-row items-center ml-4">
            <Bell color="#3B82F6" size={24} />
            <Text className="text-2xl font-bold text-gray-900 ml-2">
              Notificações
            </Text>
          </View>
        </View>

        {/* Descrição */}
        <Text className="text-gray-600 text-base mb-8">
          Personalize suas preferências de notificações para alertas sobre o fim
          do aluguel.
        </Text>

        {/* Seção de Configurações */}
        <View className="bg-gray-50 rounded-2xl p-4">
          {/* Toggle Notificações Gerais */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                Ativar Notificações
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Receba alertas sobre seus aluguéis
              </Text>
            </View>
            <Switch
              value={settings.enableNotifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: "#D1D5DB", true: "#BFDBFE" }}
              thumbColor={settings.enableNotifications ? "#3B82F6" : "#F3F4F6"}
            />
          </View>

          {/* Toggle Som */}
          <View
            className={`flex-row items-center justify-between py-4 ${
              settings.enableNotifications
                ? "border-b border-gray-200"
                : "opacity-50"
            }`}
          >
            <View className="flex-1">
              <Text
                className={`text-lg font-semibold ${
                  settings.enableNotifications
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                Som de Notificação
              </Text>
              <Text
                className={`text-sm mt-1 ${
                  settings.enableNotifications
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                Reproduzir som ao receber alertas
              </Text>
            </View>
            <Switch
              value={settings.enableSoundNotifications}
              onValueChange={handleToggleSoundNotifications}
              disabled={!settings.enableNotifications}
              trackColor={{ false: "#D1D5DB", true: "#BFDBFE" }}
              thumbColor={
                settings.enableSoundNotifications ? "#3B82F6" : "#F3F4F6"
              }
            />
          </View>

          {/* Toggle Vibração */}
          <View
            className={`flex-row items-center justify-between py-4 ${
              settings.enableNotifications ? "" : "opacity-50"
            }`}
          >
            <View className="flex-1">
              <Text
                className={`text-lg font-semibold ${
                  settings.enableNotifications
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                Vibração
              </Text>
              <Text
                className={`text-sm mt-1 ${
                  settings.enableNotifications
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                Vibre ao receber notificações
              </Text>
            </View>
            <Switch
              value={settings.enableVibration}
              onValueChange={handleToggleVibration}
              disabled={!settings.enableNotifications}
              trackColor={{ false: "#D1D5DB", true: "#BFDBFE" }}
              thumbColor={settings.enableVibration ? "#3B82F6" : "#F3F4F6"}
            />
          </View>
        </View>

        {/* Card de Informação */}
        <View className="mt-8 bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <Text className="text-blue-900 font-semibold text-base mb-2">
            💡 Dica Importante
          </Text>
          <Text className="text-blue-800 text-sm">
            Certifique-se de ter permissões de notificação ativadas nas
            configurações do seu dispositivo para receber alertas mesmo com o
            aplicativo fechado.
          </Text>
        </View>

        {/* Card de Exemplos */}
        <View className="mt-6 bg-gray-50 rounded-2xl p-4">
          <Text className="text-gray-900 font-semibold text-base mb-4">
            📋 Você receberá notificações em:
          </Text>
          <View className="space-y-3">
            <View className="flex-row">
              <Text className="text-blue-500 font-bold mr-2">•</Text>
              <Text className="text-gray-700 flex-1">
                15 minutos antes do fim do aluguel
              </Text>
            </View>
            <View className="flex-row">
              <Text className="text-blue-500 font-bold mr-2">•</Text>
              <Text className="text-gray-700 flex-1">
                5 minutos antes do fim do aluguel
              </Text>
            </View>
            <View className="flex-row">
              <Text className="text-blue-500 font-bold mr-2">•</Text>
              <Text className="text-gray-700 flex-1">
                Quando o tempo de aluguel termina
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
