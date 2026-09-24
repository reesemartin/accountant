import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

import { AuthService } from '../services'

export function useAuthLogin(): UseMutationResult<void, Error, void, () => void> {
  const queryClient = useQueryClient()

  return useMutation<void, Error, void, () => void>({
    mutationFn: async () => {
      await AuthService.signInWithGoogle()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api/v1/auth/me'] })
    },
  })
}
