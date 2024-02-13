import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

import { ApiQueryService } from '../services'

export function useTransactionDelete(): UseMutationResult<void, Error, { id: number }, () => void> {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { id: number }, () => void>({
    mutationFn: async (payload) =>
      new ApiQueryService().delete<void>({
        endpoint: `api/v1/transaction/${payload.id}`,
      }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['api/v1/transaction'] })
      await queryClient.invalidateQueries({ queryKey: [`api/v1/transaction/${variables.id}`] })
    },
  })
}
