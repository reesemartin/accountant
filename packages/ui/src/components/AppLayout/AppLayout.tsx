import { AppBar, Paper, Stack, styled, Toolbar, Typography } from '@mui/material'

import { FC, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { HeaderActions } from '..'
import { AuthService } from './../../services'

const noHeaderActionsRoutes = ['/login', '/logout']

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: `calc(100% - ${theme.spacing(8)})`,
  maxWidth: 1550,
  width: `calc(100% - ${theme.spacing(8)})`,
  [theme.breakpoints.down('md')]: {
    height: '100%',
    width: '100%',
  },
}))

type AppLayoutProps = {
  children: React.ReactNode
}

export const AppLayout: FC<AppLayoutProps> = (props) => {
  const location = useLocation()

  const isLoggedIn = AuthService.checkToken(AuthService.getRefreshToken())

  const showHeader = useMemo(() => !noHeaderActionsRoutes.includes(location.pathname), [location.pathname])

  return (
    <Stack
      alignItems="center"
      height="100vh"
      justifyContent={showHeader ? 'start' : 'center'}
      spacing={{ md: 4, xs: 0 }}
      width="100%"
    >
      {showHeader && (
        <AppBar position="static">
          <Toolbar>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} width="100%">
              <Typography variant="h6">Dashboard</Typography>
              {isLoggedIn && <HeaderActions />}
            </Stack>
          </Toolbar>
        </AppBar>
      )}

      <StyledPaper>{props.children}</StyledPaper>
    </Stack>
  )
}
