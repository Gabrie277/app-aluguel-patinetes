import { NotificationSettings } from "@/types/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserNotificationSettings, saveUserNotificationSettings } from "./userNotificationSettingsService";

const NOTIFICATION_SETTINGS_KEY = "notification_settings";

const DEFAULT_SETTINGS: NotificationSettings = {
  enableNotifications: true,
  enableSoundNotifications: true,
  enableVibration: true,
};

/**
 * Obter configurações de notificações
 * Tenta usar as configurações do usuário logado, caso contrário usa configurações globais
 * @param userId - ID do usuário (opcional). Se fornecido, busca configurações específicas do usuário
 * @returns Configurações de notificações
 */
export async function getNotificationSettings(
  userId?: string
): Promise<NotificationSettings> {
  try {
    // Se userId foi fornecido, buscar configurações específicas do usuário
    if (userId) {
      return await getUserNotificationSettings(userId);
    }

    // Caso contrário, usar configurações globais (compatibilidade com versão anterior)
    const saved = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Salvar configurações de notificações
 * Salva tanto globalmente quanto para o usuário específico se userId for fornecido
 * @param settings - Configurações a salvar
 * @param userId - ID do usuário (opcional)
 */
export async function saveNotificationSettings(
  settings: NotificationSettings,
  userId?: string
): Promise<boolean> {
  try {
    // Salvar globalmente
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));

    // Se userId foi fornecido, salvar também para o usuário específico
    if (userId) {
      await saveUserNotificationSettings(userId, settings);
    }

    return true;
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return false;
  }
}
