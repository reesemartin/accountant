import { CircularProgress, Stack } from '@mui/material'

import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useFirebaseAuthState } from './../../hooks'

type PrivateRouteProps = {
  element: React.ReactNode | null
}
export const PrivateRoute: FC<PrivateRouteProps> = (props) => {
  const navigate = useNavigate()
  const { initializing, user } = useFirebaseAuthState()

  useEffect(() => {
    if (!initializing && !user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`, { replace: true })
    }
  }, [navigate, initializing, user])

  if (initializing) {
    return (
      <Stack alignItems="center" height="100vh" justifyContent="center" width="100vw">
        <CircularProgress />
      </Stack>
    )
  }

  return !user ? null : props.element
}
