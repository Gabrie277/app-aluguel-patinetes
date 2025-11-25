import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { NotificationService } from '../services/notificationService';

/**
 * Hook para gerenciar notificações de aluguel
 * @param rentalId - ID do aluguel
 * @param durationInMinutes - Duração total do aluguel em minutos
 * @param onNotificationReceived - Callback quando uma notificação é recebida
 * @param onNotificationPressed - Callback quando uma notificação é pressionada
 */
export function useRentalNotifications(
  rentalId: string,
  durationInMinutes: number,
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationPressed?: (response: Notifications.NotificationResponse) => void,
  userId?: string
) {
  const subscriptions = useRef<Notifications.Subscription[]>([]);

  useEffect(() => {
    // Solicitar permissões e agendar notificações
    const setupNotifications = async () => {
      const hasPermission = await NotificationService.requestPermissions();
      if (hasPermission) {
        NotificationService.scheduleRentalEndingNotifications(rentalId, durationInMinutes, userId);
      }
    };

    setupNotifications();

    // Adicionar listeners
    if (onNotificationReceived) {
      const receivedSubscription = NotificationService.addNotificationReceivedListener(
        onNotificationReceived
      );
      subscriptions.current.push(receivedSubscription);
    }

    if (onNotificationPressed) {
      const responseSubscription = NotificationService.addNotificationResponseListener(
        onNotificationPressed
      );
      if (responseSubscription) {
        subscriptions.current.push(responseSubscription);
      }
    }

    // Cleanup
    return () => {
      NotificationService.cancelRentalNotifications(rentalId);
      subscriptions.current.forEach((sub) => sub.remove());
      subscriptions.current = [];
    };
  }, [rentalId, durationInMinutes, onNotificationReceived, onNotificationPressed]);
}
