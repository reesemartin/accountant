import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

import { useNavigate } from 'react-router-dom'

import { ApiQueryService, AuthService } from '../services'

export function useAuthLogout(): UseMutationResult<boolean, Error, void, () => void> {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation<boolean, Error, void, () => void>({
    mutationFn: async () =>
      new ApiQueryService().post<boolean>({
        endpoint: 'api/v1/auth/logout',
      }),
    onError: () => {
      AuthService.setAccessToken(null)
      AuthService.setRefreshToken(null)
      navigate('/login')
    },
    onSuccess: async () => {
      AuthService.setAccessToken(null)
      AuthService.setRefreshToken(null)
      queryClient.invalidateQueries({ queryKey: ['api/v1/auth/me'] })
      navigate('/login')
    },
  })
}
