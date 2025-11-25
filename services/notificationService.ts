import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { RentalNotification } from '../types/notifications';
import { getNotificationSettings } from './notificationSettingsService';

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  private static notificationTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Solicitar permissão para enviar notificações
   */
  static async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Notificações push só funcionam em dispositivos físicos');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      return false;
    }
  }

  /**
   * Enviar notificação local
   */
  static async sendLocalNotification(
    notification: RentalNotification,
    userId?: string
  ): Promise<string | null> {
    try {
      // Verificar configurações do usuário (aceita userId opcional)
      const settings = await getNotificationSettings(userId);
      
      // Se notificações estão desabilitadas, não enviar
      if (!settings.enableNotifications) {
        console.log('Notificações desabilitadas pelo usuário');
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: {
            type: notification.type,
            timeRemaining: notification.timeRemaining,
          },
          sound: settings.enableSoundNotifications ? 'default' : undefined,
          badge: 1,
        },
        trigger: null, // enviar imediatamente
      });

      // Aplicar vibração se habilitado
      if (settings.enableVibration) {
        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
          console.error('Erro ao vibrar:', error);
        }
      }

      return notificationId;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return null;
    }
  }

  /**
   * Agendar notificações de aluguel terminando
   * @param rentalId - ID do aluguel
   * @param durationInMinutes - Duração total do aluguel em minutos
   */
  static scheduleRentalEndingNotifications(
    rentalId: string,
    durationInMinutes: number,
    userId?: string
  ): void {
    // Limpar timers anteriores se existirem
    this.cancelRentalNotifications(rentalId);

    // Notificação com 15 minutos restantes
    if (durationInMinutes > 15) {
      const timeout15 = setTimeout(() => {
        this.sendLocalNotification(
          {
            id: `${rentalId}-15min`,
            type: 'rental-ending-soon',
            title: '⏰ Aluguel terminando em breve',
            body: 'Faltam 15 minutos para o fim do aluguel!',
            timeRemaining: 15,
            timestamp: new Date(),
            isRead: false,
          },
          userId
        );
      }, (durationInMinutes - 15) * 60 * 1000);

      this.notificationTimers.set(`${rentalId}-15min`, timeout15);
    }

    // Notificação com 5 minutos restantes
    if (durationInMinutes > 5) {
      const timeout5 = setTimeout(() => {
        this.sendLocalNotification(
          {
            id: `${rentalId}-5min`,
            type: 'rental-ending-soon',
            title: '⏰ Aluguel terminando em breve',
            body: 'Faltam apenas 5 minutos para o fim do aluguel!',
            timeRemaining: 5,
            timestamp: new Date(),
            isRead: false,
          },
          userId
        );
      }, (durationInMinutes - 5) * 60 * 1000);

      this.notificationTimers.set(`${rentalId}-5min`, timeout5);
    }

    // Notificação quando o tempo acabou
    const timeoutEnd = setTimeout(() => {
      this.sendLocalNotification(
        {
          id: `${rentalId}-ended`,
          type: 'rental-ended',
          title: '⏱️ Tempo do aluguel expirado',
          body: 'O tempo do seu aluguel já acabou. Dirija-se até a estação de devolução!',
          timestamp: new Date(),
          isRead: false,
        },
        userId
      );
    }, durationInMinutes * 60 * 1000);

    this.notificationTimers.set(`${rentalId}-ended`, timeoutEnd);
  }

  /**
   * Cancelar todas as notificações agendadas para um aluguel
   */
  static cancelRentalNotifications(rentalId: string): void {
    const timerIds = Array.from(this.notificationTimers.keys()).filter((key) =>
      key.startsWith(rentalId)
    );

    timerIds.forEach((id) => {
      const timer = this.notificationTimers.get(id);
      if (timer) {
        clearTimeout(timer);
        this.notificationTimers.delete(id);
      }
    });
  }

  /**
   * Cancelar todas as notificações agendadas
   */
  static cancelAllNotifications(): void {
    this.notificationTimers.forEach((timer) => clearTimeout(timer));
    this.notificationTimers.clear();
  }

  /**
   * Adicionar listener para quando uma notificação é recebida
   */
  static addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }

  private static responseListenerSubscription: Notifications.Subscription | null = null;

  /**
   * Adicionar listener para quando uma notificação é pressionada
   * Retorna a subscription ou null se não for possível registrar
   */
  static addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription | null {
    // Alguns builds/versões do pacote expõem métodos diferentes.
    // Usamos acesso dinâmico para ser resiliente a pequenas diferenças.
    const addResponseReceived = (Notifications as any).addNotificationResponseReceivedListener;
    const addResponseCleared = (Notifications as any).addNotificationResponseClearedListener;

    const fn = addResponseReceived ?? addResponseCleared;
    if (!fn) return null;

    const sub = fn(callback as any) as Notifications.Subscription;
    this.responseListenerSubscription = sub;
    return sub;
  }
}
