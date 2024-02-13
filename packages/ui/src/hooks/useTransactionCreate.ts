import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

import { Frequency, Transaction } from '../models'
import { ApiQueryService } from '../services'

export type TransactionCreateDTO = {
  amount: number
  description: string
  frequency?: Frequency | null
  recurring?: boolean
  startDate: Date
}

export function useTransactionCreate(): UseMutationResult<Transaction, Error, TransactionCreateDTO, () => void> {
  const queryClient = useQueryClient()

  return useMutation<Transaction, Error, TransactionCreateDTO, () => void>({
    mutationFn: async (payload) =>
      new ApiQueryService().post<Transaction>({
        data: payload,
        endpoint: 'api/v1/transaction',
      }),
    onSuccess: async (transaction) => {
      await queryClient.invalidateQueries({ queryKey: ['api/v1/transaction'] })
      return transaction
    },
  })
}
