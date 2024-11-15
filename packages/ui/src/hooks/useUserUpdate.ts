import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'

import { User } from '../models'
import { ApiQueryService } from '../services'

export type UserUpdateDTO = {
  name?: string
  email?: string
}

export function useUserUpdate(): UseMutationResult<User, Error, UserUpdateDTO, () => void> {
  const queryClient = useQueryClient()

  return useMutation<User, Error, UserUpdateDTO, () => void>({
    mutationFn: async (payload) =>
      new ApiQueryService().patch<User>({
        data: payload,
        endpoint: `api/v1/user`,
      }),
    onSuccess: async (user) => {
      queryClient.invalidateQueries({ queryKey: [`api/v1/auth/me`] })
      return user
    },
  })
}
