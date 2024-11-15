import { QueryKey, useSuspenseQuery, UseSuspenseQueryOptions } from '@tanstack/react-query'

import { BankAccount } from '../models'
import { ApiQueryService } from '../services'

export type BankAccountFindManyDTO = {
  name?: string
  orderBy?: keyof BankAccount
  orderByDirection?: 'asc' | 'desc' | 'ASC' | 'DESC'
  skip?: number
  take?: number
}

export function useBankAccountFindMany(
  params?: BankAccountFindManyDTO,
  config?: Omit<UseSuspenseQueryOptions<BankAccount[], Error, BankAccount[], QueryKey>, 'queryFn' | 'queryKey'>,
) {
  return useSuspenseQuery<BankAccount[]>({
    ...config,
    queryFn: async () =>
      new ApiQueryService().get<BankAccount[]>({
        endpoint: 'api/v1/bank-account',
        params,
      }),
    queryKey: ['api/v1/bank-account', params],
  })
}
