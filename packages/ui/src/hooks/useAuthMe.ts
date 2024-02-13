import { QueryKey, useSuspenseQuery, UseSuspenseQueryOptions } from '@tanstack/react-query'

import { User } from '../models'
import { ApiQueryService } from '../services'

export function useAuthMe(config?: Omit<UseSuspenseQueryOptions<User, Error, User, QueryKey>, 'queryFn' | 'queryKey'>) {
  return useSuspenseQuery<User>({
    ...config,
    queryFn: async () =>
      new ApiQueryService().get<User>({
        endpoint: 'api/v1/auth/me',
      }),
    queryKey: ['api/v1/auth/me'],
    refetchOnWindowFocus: 'always',
  })
}
