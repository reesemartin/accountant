import { Button, CircularProgress, Stack, styled, Typography } from '@mui/material'

import { FC, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useAuthLogin, useFirebaseAuthState } from '../hooks'

const StyledLogoBox = styled('img')({
  maxWidth: '100%',
  width: 150,
})

export const Login: FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { initializing, user } = useFirebaseAuthState()
  const login = useAuthLogin()

  const onSignIn = useCallback(async () => {
    await login.mutateAsync()
    navigate(searchParams.get('redirect') || '/')
  }, [searchParams])

  useEffect(() => {
    if (!initializing && user) {
      navigate(searchParams.get('redirect') || '/')
    }
  }, [initializing, user])

  return (
    <Stack
      alignItems="center"
      height="100%"
      justifyContent="center"
      spacing={4}
      width="100%"
      maxWidth="400px"
      marginX="auto"
    >
      {(initializing || login.isPending) && <CircularProgress size={80} />}
      {!initializing && !login.isPending && (
        <>
          <StyledLogoBox alt="Accountant" src="/favicon.png" />
          <Button color="primary" variant="contained" fullWidth onClick={onSignIn}>
            Sign in with Google
          </Button>
          {login.isError && <Typography color="error">Sorry, sign in failed. Please try again.</Typography>}
        </>
      )}
    </Stack>
  )
}
