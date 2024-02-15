import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

import { UserWithAuth } from '../models'
import { ApiQueryService, AuthService } from '../services'

export type LoginDTO = { email: string; password: string }

export function useAuthLogin(): UseMutationResult<UserWithAuth, Error, LoginDTO, () => void> {
  const queryClient = useQueryClient()

  return useMutation<UserWithAuth, Error, LoginDTO, () => void>({
    mutationFn: async (payload) =>
      new ApiQueryService().post<UserWithAuth>({
        data: payload,
        endpoint: 'api/v1/auth/login',
      }),
    onError: () => {
      AuthService.setAccessToken(null)
      AuthService.setRefreshToken(null)
    },
    onSuccess: async (user) => {
      AuthService.setAccessToken(user.tokens.accessToken)
      AuthService.setRefreshToken(user.tokens.refreshToken)
      queryClient.invalidateQueries({ queryKey: ['api/v1/auth/me'] })
    },
  })
}
