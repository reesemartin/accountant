import { QueryKey, useSuspenseQuery, UseSuspenseQueryOptions } from '@tanstack/react-query'

import { ApiQueryService } from '../services'

type Health = {
  healthy: boolean
}

export function useHealth(
  config?: Omit<UseSuspenseQueryOptions<Health, Error, Health, QueryKey>, 'queryFn' | 'queryKey'>,
) {
  return useSuspenseQuery<Health>({
    ...config,
    queryFn: async () =>
      new ApiQueryService().get<{ healthy: boolean }>({
        endpoint: 'api/v1/health',
      }),
    queryKey: ['api/v1/health'],
  })
}
