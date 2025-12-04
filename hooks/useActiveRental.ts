import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import queryClient from '../services/queryClient';
import { getActiveRental, subscribeToRentalChanges } from '../services/rentalService';

/**
 * Hook que retorna o aluguel ativo do usuário e atualiza o cache quando houver mudanças via subscription.
 * @param userId - ID do usuário
 */
export function useActiveRental(userId?: string) {
	const queryKey = ['activeRental', userId];

	const query = useQuery(
		queryKey,
		() => (userId ? getActiveRental(userId) : Promise.resolve(null)),
		{
			enabled: !!userId,
			staleTime: 1000 * 60, // 1 minute
		}
	);

	useEffect(() => {
		if (!userId) return;
		const unsubscribe = subscribeToRentalChanges(userId, (rental: any) => {
			queryClient.setQueryData(queryKey, rental);
		});

		return () => {
			try {
				unsubscribe();
			} catch (e) {
				// ignore
			}
		};
	}, [userId]);

	return query;
}
