import { CircularProgress, Stack } from '@mui/material'

import { FC, useEffect } from 'react'

import { useAuthLogout } from './../hooks'

export const Logout: FC = () => {
  const logout = useAuthLogout()

  useEffect(() => {
    logout.mutate()
  }, [])

  return (
    <Stack alignItems="center" height="100vh" justifyContent="center" width="100vw">
      <CircularProgress />
    </Stack>
  )
}
