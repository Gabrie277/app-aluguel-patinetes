import { NotificationSettings } from "@/types/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Serviço para gerenciar configurações de notificações por usuário
 * Armazena e recupera as configurações de notificações do usuário logado
 */

const USER_NOTIFICATION_SETTINGS_PREFIX = "user_notification_settings_";

const DEFAULT_SETTINGS: NotificationSettings = {
  enableNotifications: true,
  enableSoundNotifications: true,
  enableVibration: true,
};

/**
 * Obter configurações de notificações de um usuário específico
 * @param userId - ID do usuário
 * @returns Configurações de notificações do usuário ou padrão
 */
export async function getUserNotificationSettings(
  userId: string
): Promise<NotificationSettings> {
  try {
    const key = `${USER_NOTIFICATION_SETTINGS_PREFIX}${userId}`;
    const saved = await AsyncStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Erro ao carregar configurações de notificações do usuário:", error);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Salvar configurações de notificações para um usuário específico
 * @param userId - ID do usuário
 * @param settings - Configurações de notificações a salvar
 */
export async function saveUserNotificationSettings(
  userId: string,
  settings: NotificationSettings
): Promise<boolean> {
  try {
    const key = `${USER_NOTIFICATION_SETTINGS_PREFIX}${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error("Erro ao salvar configurações de notificações do usuário:", error);
    return false;
  }
}

/**
 * Remover configurações de notificações de um usuário (útil para logout)
 * @param userId - ID do usuário
 */
export async function clearUserNotificationSettings(
  userId: string
): Promise<boolean> {
  try {
    const key = `${USER_NOTIFICATION_SETTINGS_PREFIX}${userId}`;
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Erro ao remover configurações de notificações do usuário:", error);
    return false;
  }
}
