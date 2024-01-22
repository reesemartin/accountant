import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

import { UserWithAuth } from '../models/user.model'
import { AuthService } from '../services'

export type LoginParams = { email: string; password: string }

export function useAuthLogin(): UseMutationResult<UserWithAuth, Error, LoginParams, () => void> {
  const queryClient = useQueryClient()

  return useMutation<UserWithAuth, Error, LoginParams, () => void>({
    mutationFn: (payload) => AuthService.login(payload),
    onError: (error: Error) => {
      console.error(error)
      AuthService.setAccessToken(null)
      AuthService.setRefreshToken(null)
    },
    onSuccess: async (user) => {
      AuthService.setAccessToken(user.tokens.accessToken)
      AuthService.setRefreshToken(user.tokens.refreshToken)
      await queryClient.invalidateQueries({ queryKey: ['AuthService.me'] })
    },
  })
}
