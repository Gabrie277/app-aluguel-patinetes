declare module '@supabase/supabase-js' {
  // Declaração mínima para evitar erros de build quando o pacote não estiver instalado
  // Ajuste conforme necessário quando instalar o pacote real

  export interface User {
    id: string;
    [key: string]: any;
  }

  export interface Session {
    user?: User | null;
    access_token?: string;
    [key: string]: any;
  }

  export interface SupabaseAuthGetUserResult {
    data: { user: User | null };
    error?: any;
  }

  export type SupabaseClient = any;

  export function createClient(url: string, key: string): SupabaseClient;

  export type UserType = User;
  export type SessionType = Session;

  export { User as User, Session as Session };
}
