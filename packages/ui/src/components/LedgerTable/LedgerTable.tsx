import { Box } from '@mui/material'

import dayjs from 'dayjs'
import { FC } from 'react'

import { useTransactionFindMany } from '../../hooks'

export const LedgerTable: FC = () => {
  const transactions = useTransactionFindMany({
    start: dayjs().format('YYYY-MM-DD'),
  })

  return (
    <Box>
      {transactions.data?.map((transaction) => (
        <Box key={transaction.id}>
          {dayjs(transaction.startDate).format('YYYY-MM-DD')} | {transaction.description} | ${transaction.amount} |{' '}
          {transaction.recurring ? `Recurring ${transaction.frequency}` : 'One Time'}
        </Box>
      ))}
    </Box>
  )
}
