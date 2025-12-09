import { Stack } from "expo-router";
import React, { useEffect } from 'react';
import { supabase } from '@/config/supabaseConfig';
import LocationService from '@/services/locationService';

export default function RootLayout() {
  useEffect(() => {
    // Ouve mudanças de autenticação no Supabase
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Solicita permissão de localização quando o usuário fizer login
          const granted = await LocationService.requestLocationPermission();
          if (granted) {
            // Obtém a localização inicial após permissão
            await LocationService.getCurrentLocation();
          }
        } catch (err) {
          console.warn('Erro ao solicitar permissão após login:', err);
        }
      }
    });

    const subscription = (data as any)?.subscription;

    return () => {
      // Limpar listener ao desmontar
      try {
        subscription?.unsubscribe?.();
      } catch (err) {
        // fallback: se a API tiver formato diferente, ignorar
      }
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "App" }} />
      <Stack.Screen name="configuracoes-usuario" options={{ title: "Configurações do Usuário" }} />
      <Stack.Screen name="screens/teste/index" options={{ title: "Teste" }} />
      <Stack.Screen name="screens/RideSummary" options={{ headerShown: false }} />
      <Stack.Screen name="screens/pagamento/index" options={{ title: "Pagamento" }} />
      <Stack.Screen
        name="screens/detalhes-patinete/index"
        options={{ title: "Patinetes" }}
      />
      <Stack.Screen
        name="screens/detalhes-patinete/[id]/index"
        options={{ title: "Detalhes do Patinete" }}
      />
    </Stack>
  );
}
