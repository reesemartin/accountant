import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

import { Frequency, Transaction } from '../models'
import { ApiQueryService } from '../services'

export type TransactionUpdateDTO = {
  id: number
  amount?: number
  description?: string
  frequency?: Frequency | null
  recurring?: boolean
  startDate?: string
}

export function useTransactionUpdate(): UseMutationResult<Transaction, Error, TransactionUpdateDTO, () => void> {
  const queryClient = useQueryClient()

  return useMutation<Transaction, Error, TransactionUpdateDTO, () => void>({
    mutationFn: async (payload) =>
      new ApiQueryService().patch<Transaction>({
        data: { ...payload, id: undefined },
        endpoint: `api/v1/transaction/${payload.id}`,
      }),
    onSuccess: async (transaction) => {
      queryClient.invalidateQueries({ queryKey: ['api/v1/transaction'] })
      queryClient.invalidateQueries({ queryKey: [`api/v1/transaction/${transaction.id}`] })
      return transaction
    },
  })
}
