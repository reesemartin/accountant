import { Unstable_Grid2 as Grid } from '@mui/material'

import { FC } from 'react'

import { LedgerTable, TransactionCreateForm } from '../components'

export const Dashboard: FC = () => {
  return (
    <Grid alignItems="start" container justifyContent="center" spacing={4} width="100%">
      <Grid xs={9}>
        <LedgerTable />
      </Grid>
      <Grid xs={3}>
        <TransactionCreateForm />
      </Grid>
    </Grid>
  )
}
