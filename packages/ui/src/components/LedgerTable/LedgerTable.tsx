import { Button, CircularProgress, Stack, TextField } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import dayjs from 'dayjs'
import Decimal from 'decimal.js'
import { Field, Form, Formik } from 'formik'
import { FC, useCallback, useMemo, useState } from 'react'

import { useAuthMe, useTransactionDelete, useTransactionFindMany, useUserUpdate } from '../../hooks'
import { Frequency, Transaction } from './../../models'

export const LedgerTable: FC = () => {
  const [years, setYears] = useState(2)

  const authMe = useAuthMe()

  const transactionDelete = useTransactionDelete()
  const userUpdate = useUserUpdate()

  const oneTimeTransactions = useTransactionFindMany({
    recurring: false,
    start: dayjs().format('YYYY-MM-DD'),
  })
  const recurringTransactions = useTransactionFindMany({
    recurring: true,
  })

  const onBalanceSubmit = useCallback(
    async (values: { balance: number }) => {
      await userUpdate.mutateAsync({ balance: values.balance || 0, id: authMe.data.id })
    },
    [userUpdate, authMe],
  )

  const onDelete = useCallback(
    (id: number) => {
      transactionDelete.mutateAsync({ id })
    },
    [transactionDelete],
  )

  const ledgerEntries = useMemo(() => {
    let balance = new Decimal(authMe.data.balance)
    return [...(oneTimeTransactions.data || []), ...(recurringTransactions.data || [])]
      .flatMap((transaction) => {
        if (transaction.recurring && transaction.frequency) {
          const frequencyMapping: Record<Frequency, { unit: 'day' | 'week' | 'month' | 'year'; multiplier: number }> = {
            Annually: { multiplier: 1, unit: 'year' },
            BiMonthly: { multiplier: 1, unit: 'month' },
            BiWeekly: { multiplier: 2, unit: 'week' },
            Daily: { multiplier: 1, unit: 'day' },
            Monthly: { multiplier: 1, unit: 'month' },
            Weekly: { multiplier: 1, unit: 'week' },
          }

          const frequencyMappingMatch = frequencyMapping[transaction.frequency]

          if (!frequencyMappingMatch) {
            return []
          }

          return Array.from({
            length:
              transaction.frequency === 'Annually'
                ? years
                : Math.ceil(
                    dayjs().add(years, 'year').diff(dayjs(transaction.startDate), frequencyMappingMatch.unit) /
                      frequencyMappingMatch.multiplier,
                  ),
          }).flatMap((_, i) => {
            const baseDate = dayjs(transaction.startDate).add(
              i * frequencyMappingMatch.multiplier,
              frequencyMappingMatch.unit,
            )
            if (transaction.frequency === 'BiMonthly') {
              return [
                {
                  ...transaction,
                  startDate: baseDate.date(15).format('YYYY-MM-DD'),
                },
                {
                  ...transaction,
                  startDate: baseDate.endOf('month').format('YYYY-MM-DD'),
                },
              ]
            }

            return [
              {
                ...transaction,
                startDate: baseDate.format('YYYY-MM-DD'),
              },
            ]
          })
        }

        return [transaction]
      })
      .filter((transaction) => dayjs(transaction.startDate).isBefore(dayjs().add(years, 'year')))
      .sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate)))
      .map((transaction) => {
        const newBalance = balance.add(new Decimal(transaction.amount))
        balance = newBalance
        return {
          ...transaction,
          balance: newBalance.toNumber(),
        }
      })
  }, [authMe.data.balance, oneTimeTransactions.data, recurringTransactions.data, years])

  const columns: GridColDef<Transaction & { balance: number }>[] = [
    {
      field: 'delete',
      headerName: 'Delete',
      renderCell: (params) => {
        const onClick = () => {
          onDelete(params.row.id)
        }

        return (
          <Button color="primary" variant="text" onClick={onClick}>
            Delete
          </Button>
        )
      },
      sortable: false,
      width: 100,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD'),
      width: 150,
    },
    { field: 'description', headerName: 'Description', width: 150 },
    { field: 'amount', headerName: 'Amount', valueFormatter: (params) => `$${params.value}`, width: 150 },
    { field: 'balance', headerName: 'Balance', valueFormatter: (params) => `$${params.value}`, width: 150 },
  ]

  return (
    <Stack spacing={4}>
      <Stack direction={{ sm: 'row', xs: 'column' }} spacing={2} alignItems="center">
        <TextField
          onChange={(e) => setYears(Number(e.target.value))}
          type="number"
          label="Years Displayed"
          value={years}
          inputProps={{
            min: 1,
          }}
        />

        <Formik
          initialValues={{
            balance: Number(authMe.data.balance),
          }}
          onSubmit={onBalanceSubmit}
        >
          <Form>
            <Stack direction={{ sm: 'row', xs: 'column' }} spacing={2} alignItems="center">
              {userUpdate.isPending && <CircularProgress size={20} />}
              {!userUpdate.isPending && (
                <>
                  <Field as={TextField} type="number" name="balance" label="Balance" />
                  <Button color="primary" variant="contained" type="submit">
                    Save Balance
                  </Button>
                </>
              )}
            </Stack>
          </Form>
        </Formik>
      </Stack>
      <DataGrid
        getRowId={(transaction: Transaction) => `${transaction.id}_${transaction.startDate}`}
        rows={ledgerEntries}
        columns={columns}
        hideFooter
      />
    </Stack>
  )
}
