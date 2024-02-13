import { QueryKey, useSuspenseQuery, UseSuspenseQueryOptions } from '@tanstack/react-query'

import { Transaction } from '../models'
import { ApiQueryService } from '../services'

export type TransactionFindManyDTO = {
  disabled?: boolean
  end?: string
  orderBy?: keyof Transaction
  orderByDirection?: 'asc' | 'desc' | 'ASC' | 'DESC'
  recurring?: boolean
  skip?: number
  start?: string
  take?: number
}

export function useTransactionFindMany(
  params?: TransactionFindManyDTO,
  config?: Omit<UseSuspenseQueryOptions<Transaction[], Error, Transaction[], QueryKey>, 'queryFn' | 'queryKey'>,
) {
  return useSuspenseQuery<Transaction[]>({
    ...config,
    queryFn: async () =>
      new ApiQueryService().get<Transaction[]>({
        endpoint: 'api/v1/transaction',
        params,
      }),
    queryKey: ['api/v1/transaction', params],
  })
}
