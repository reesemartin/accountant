import { QueryKey, useSuspenseQuery, UseSuspenseQueryOptions } from '@tanstack/react-query'

import { HealthService } from './../services'

type Health = {
  healthy: boolean
}

export function useHealth(
  config?: Omit<UseSuspenseQueryOptions<Health, Error, Health, QueryKey>, 'queryFn' | 'queryKey'>,
) {
  return useSuspenseQuery<Health>({
    ...config,
    queryFn: () => HealthService.get(),
    queryKey: ['HealthService.get'],
  })
}
