import { Unstable_Grid2 as Grid, Typography } from '@mui/material'

import { FC } from 'react'

import useHealth from './../hooks/useHealth'

export const Home: FC = () => {
  const health = useHealth()

  return (
    <Grid alignItems="center" container height="100vh" justifyContent="center" spacing={4} width="100vw">
      <Grid>
        <Typography>{health.data.healthy ? 'Ready to get started!' : 'Api not ready'}</Typography>
      </Grid>
    </Grid>
  )
}
