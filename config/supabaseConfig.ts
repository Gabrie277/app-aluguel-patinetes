// Import dinamicamente para evitar erro quando o pacote não estiver instalado
let createClient: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  createClient = require('@supabase/supabase-js').createClient;
} catch (err) {
  createClient = null;
}

// ⚠️ IMPORTANTE: Substitua estas credenciais pelas suas credenciais reais do Supabase
// Você pode encontrá-las em: https://app.supabase.com/project/[seu-projeto]/settings/api

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sua-chave-anonima-aqui';

// Validação básica das credenciais
if (!SUPABASE_URL || SUPABASE_URL.includes('seu-projeto')) {
  console.warn(
    'Aviso: Credenciais do Supabase não configuradas. ' +
    'Configure as variáveis de ambiente EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local'
  );
}

// Flag simples para verificar se o Supabase foi configurado corretamente
export const isSupabaseConfigured =
  !!process.env.EXPO_PUBLIC_SUPABASE_URL &&
  !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.EXPO_PUBLIC_SUPABASE_URL.includes('seu-projeto') &&
  !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY.includes('sua-chave-anonima');

// Se o createClient estiver disponível e as credenciais não forem placeholders,
// crie o cliente; caso contrário, exporte um mock mínimo para evitar erros em tempo de execução
export const supabase = (createClient && isSupabaseConfigured)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : {
      // mock mínimo: fornece `auth.getUser()` e `from().insert()` para chamadas seguras
      auth: {
        async getUser() {
          return { data: { user: null } };
        },
      },
      from: () => ({
        async insert() {
          return { error: null };
        },
      }),
    } as any;
