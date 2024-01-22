import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

import { useNavigate } from 'react-router-dom'

import { AuthService } from '../services'

export function useAuthLogout(): UseMutationResult<boolean, Error, void, () => void> {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation<boolean, Error, void, () => void>({
    mutationFn: () => AuthService.logout(),
    onError: (error: Error) => {
      console.error(error)
      AuthService.setAccessToken(null)
      AuthService.setRefreshToken(null)
      navigate('/')
    },
    onSuccess: async () => {
      AuthService.setAccessToken(null)
      AuthService.setRefreshToken(null)
      await queryClient.invalidateQueries({ queryKey: ['AuthService.me'] })
      navigate('/login')
    },
  })
}
