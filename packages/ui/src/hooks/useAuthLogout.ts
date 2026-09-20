import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

import { useNavigate } from 'react-router-dom'

import { AuthService } from '../services'

export function useAuthLogout(): UseMutationResult<void, Error, void, () => void> {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation<void, Error, void, () => void>({
    mutationFn: async () => AuthService.signOut(),
    onSettled: () => {
      queryClient.removeQueries({ queryKey: ['api/v1/auth/me'] })
      navigate('/login')
    },
  })
}
