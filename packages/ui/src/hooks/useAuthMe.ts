import { QueryKey, useSuspenseQuery, UseSuspenseQueryOptions } from '@tanstack/react-query'

import { User } from '../models/user.model'
import { AuthService } from '../services'

export function useAuthMe(config?: Omit<UseSuspenseQueryOptions<User, Error, User, QueryKey>, 'queryFn' | 'queryKey'>) {
  return useSuspenseQuery<User>({
    ...config,
    queryFn: () => AuthService.me(),
    queryKey: ['AuthService.me'],
  })
}
