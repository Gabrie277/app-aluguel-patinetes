import { useMutation } from '@tanstack/react-query';
import queryClient from '../services/queryClient';
import { createRental } from '../services/rentalService';

/**
 * Hook para criar um novo aluguel (mutation). Atualiza o cache `activeRental` com o resultado.
 * @param userId - ID do usuário (usado para atualizar a query correta)
 */
export function useCreateRental(userId?: string) {
	return useMutation(
		({ durationInMinutes }: { durationInMinutes: number }) => {
			if (!userId) return Promise.reject(new Error('userId is required'));
			return createRental(userId, durationInMinutes) as Promise<any>;
		},
		{
			onSuccess: (data) => {
				// Atualiza diretamente o cache da query activeRental
				const key = ['activeRental', userId];
				queryClient.setQueryData(key, data);
			},
		}
	);
}
