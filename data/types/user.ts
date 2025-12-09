import { NotificationSettings } from "@/types/notifications";

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  saldo: number;
  ativo: boolean;
  notificationSettings?: NotificationSettings;
}