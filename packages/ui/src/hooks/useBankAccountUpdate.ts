import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

import { BankAccount } from '../models'
import { ApiQueryService } from '../services'

export type BankAccountUpdateDTO = {
  id: number
  balance?: number
  name?: string
}

export function useBankAccountUpdate(): UseMutationResult<BankAccount, Error, BankAccountUpdateDTO, () => void> {
  const queryClient = useQueryClient()

  return useMutation<BankAccount, Error, BankAccountUpdateDTO, () => void>({
    mutationFn: async (payload) =>
      new ApiQueryService().patch<BankAccount>({
        data: { ...payload, id: undefined },
        endpoint: `api/v1/bank-account/${payload.id}`,
      }),
    onSuccess: async (bankAccount) => {
      queryClient.invalidateQueries({ queryKey: ['api/v1/bank-account'] })
      queryClient.invalidateQueries({ queryKey: [`api/v1/bank-account/${bankAccount.id}`] })
      return bankAccount
    },
  })
}
