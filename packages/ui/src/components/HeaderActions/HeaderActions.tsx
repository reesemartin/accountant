import { Button, Stack, styled, Typography } from '@mui/material'

import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuthMe } from '../../hooks'

const StyledTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}))

export const HeaderActions: FC = () => {
  const navigate = useNavigate()
  const me = useAuthMe()

  const user = me.data

  useEffect(() => {
    if (me.error) {
      navigate('/logout')
    }
  }, [me.error])

  return (
    <Stack direction="row" justifyContent="end" alignItems="center" spacing={2}>
      <StyledTypography>Welcome {user.name}!</StyledTypography>
      <Button href="/logout">Logout</Button>
    </Stack>
  )
}
