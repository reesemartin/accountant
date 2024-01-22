import { Button, Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material'

import { FC } from 'react'

import { useAuthMe } from './../hooks'

export const Home: FC = () => {
  const me = useAuthMe()
  const user = me.data

  return (
    <Grid alignItems="center" container height="100vh" justifyContent="center" spacing={4} width="100vw">
      <Grid>
        <Stack spacing={2}>
          <Typography>Welcome {user.name}!</Typography>
          <Button href="/logout">Logout</Button>
        </Stack>
      </Grid>
    </Grid>
  )
}
