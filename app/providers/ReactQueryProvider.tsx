import { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from 'react-query-native-devtools';
import queryClient from '../../services/queryClient';

export default function ReactQueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* ReactQuery Devtools: shown only in dev mode */}
      {__DEV__ && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
