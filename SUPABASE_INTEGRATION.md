# Integração com Supabase (guia em Português)

Este documento explica como integrar o Supabase como backend para os dados de
aluguel (rentals) e como conectar esses dados ao fluxo de notificações já
implementado neste projeto.

Objetivo
--------
Fornecer instruções claras e código de exemplo para o desenvolvedor que irá
implementar as consultas ao Supabase, para que o app passe a usar dados reais
do aluguel (rentalId, duração, horário de início/término) e, opcionalmente,
assinar mudanças em tempo real.

Pré-requisitos
--------------
- Projeto Supabase criado
- Tabela `rentals` com um esquema semelhante ao exemplo abaixo
- Variáveis de ambiente configuradas (para desenvolvimento local use `.env`):
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY` (ou service key para operações server-side)
- Instalar a biblioteca cliente no workspace do app:

```bash
npm install @supabase/supabase-js
```

Esquema recomendado para a tabela `rentals` (Postgres)
--------------------------------------------------
```sql
CREATE TABLE rentals (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  patinete_id uuid,
  start_at timestamptz NOT NULL,
  ends_at timestamptz, -- nulo até o fim
  duration_minutes integer NOT NULL,
  status text NOT NULL DEFAULT 'active', -- active, ended, cancelled
  created_at timestamptz DEFAULT now()
);

CREATE INDEX ON rentals (user_id);
CREATE INDEX ON rentals (status);
```

API esperada pelo app
---------------------
O app espera um serviço com pelo menos as seguintes funções:

- `getActiveRental(userId: string): Promise<null | { rentalId: string; durationInMinutes: number; startAt?: string; endsAt?: string }>`
  - Retorna o aluguel ativo do usuário ou `null`.
- `getRentalById(rentalId: string): Promise<null | { rentalId: string; durationInMinutes: number; startAt?: string; endsAt?: string }>`
  - Retorna um registro de aluguel pelo ID.
- `subscribeToRentalChanges(userId: string, callback: (rental) => void): () => void`
  - Opcional: assina mudanças em tempo real para o aluguel do usuário e retorna
    uma função `unsubscribe`.

Exemplo em TypeScript (cliente)
------------------------------
Crie o arquivo `services/rentalService.ts` (já existe um stub no repositório).
Segue um código de referência que o integrador pode adaptar:

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getActiveRental(userId: string) {
  const { data, error } = await supabase
    .from('rentals')
    .select('id, duration_minutes, start_at, ends_at, status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .limit(1)
    .single();

  if (error) {
    console.error('Erro Supabase getActiveRental:', error);
    return null;
  }

  if (!data) return null;

  return {
    rentalId: data.id,
    durationInMinutes: data.duration_minutes,
    startAt: data.start_at,
    endsAt: data.ends_at,
  };
}

export async function getRentalById(rentalId: string) {
  const { data, error } = await supabase
    .from('rentals')
    .select('id, duration_minutes, start_at, ends_at, status')
    .eq('id', rentalId)
    .limit(1)
    .single();

  if (error) {
    console.error('Erro Supabase getRentalById:', error);
    return null;
  }

  if (!data) return null;

  return {
    rentalId: data.id,
    durationInMinutes: data.duration_minutes,
    startAt: data.start_at,
    endsAt: data.ends_at,
  };
}

// Opcional: exemplo de assinatura realtime
export function subscribeToRentalChanges(userId: string, callback: (rental: any) => void) {
  const channel = supabase
    .channel('public:rentals')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rentals', filter: `user_id=eq.${userId}` }, (payload) => {
      // payload.record contém a linha alterada
      callback(payload.record);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
```

Observações e boas práticas
---------------------------
- Para apps cliente, use a anon key; para operações server-side use a service role key.
- Verifique se `duration_minutes` está na unidade esperada (minutos).
- Ao usar realtime, teste estabilidade de conexão e re-subscribe após reconexões.
- Considere armazenar `ends_at` ou calcular tempo restante no servidor para consistência.

Como integrar no app
--------------------
1. No fluxo de início da corrida, crie o registro de aluguel no Supabase e retorne `id` e `duration_minutes`.
2. Na tela que gerencia a corrida ativa (`app/screens/sua_corrida/index.tsx`) chame `getActiveRental(userId)` quando o componente montar.
   - Se retornar um aluguel ativo, passe `rentalId` e `durationInMinutes` para `useRentalNotifications` (substituindo os valores mockados atuais).
3. Opcional: use `subscribeToRentalChanges(userId, callback)` para reagir quando a duração ou status do aluguel for alterado (ex.: extendido ou finalizado antes do previsto).

Testes locais
-------------
- Rode o app em um dispositivo físico (necessário para notificações locais e vibração).
- Crie registros de teste em Supabase para seu usuário e verifique se o app os recupera.
- Use a assinatura realtime para simular atualizações do servidor (alterar `status` para `ended` e verificar se os timers são cancelados).

Segurança & privacidade
----------------------
- Mantenha as chaves do Supabase fora do controle de versão. Use variáveis de ambiente ou um gerenciador de segredos.
- Evite armazenar dados sensíveis no AsyncStorage do cliente.

Próximos passos sugeridos
------------------------
- Posso implementar o `services/rentalService.ts` usando `@supabase/supabase-js` (precisarei que você configure variáveis de ambiente ou eu insira placeholders).
- Posso também atualizar `app/screens/sua_corrida/index.tsx` para chamar `getActiveRental(usuario.id)` ao montar e usar os resultados para `useRentalNotifications`.

Check-list rápida para o integrador Supabase
------------------------------------------
1. Criar tabela `rentals` com campos mínimos: `id`, `user_id`, `duration_minutes`, `start_at`, `ends_at`, `status`.
2. Configurar variáveis de ambiente no projeto.
3. Implementar `getActiveRental` e `getRentalById` no `services/rentalService.ts`.
4. Testar fluxo em dispositivo físico e ajustar se necessário.

---
Arquivo gerado: guia de integração com Supabase (versão em Português)
