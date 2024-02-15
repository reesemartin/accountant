import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'

import dayjs, { Dayjs } from 'dayjs'
import {
  Field,
  Form,
  Formik, //
  // TODO: Remove the need for this once we figure out why FormikHelpers is not typed as being exported
  // eslint-disable-next-line import/named
  FormikHelpers,
} from 'formik'
import { Select, Switch } from 'formik-mui'
import { FC, useCallback } from 'react'
import * as yup from 'yup'

import { TransactionCreateDTO, useTransactionCreate } from '../../hooks'
import { Frequency } from '../../models'

type FormikTransactionCreateDTO = Omit<TransactionCreateDTO, 'startDate'> & { startDate: Dayjs | null }

const validationSchema = yup.object().shape({
  amount: yup.number().required(),
  description: yup.string().required(),
  frequency: yup.string().oneOf(Object.values(Frequency)),
  recurring: yup.boolean(),
  startDate: yup.date().required(),
})

export const TransactionCreateForm: FC = () => {
  const transactionCreate = useTransactionCreate()

  const onSubmit = useCallback(
    async (values: FormikTransactionCreateDTO, formikHelpers: FormikHelpers<FormikTransactionCreateDTO>) => {
      await transactionCreate.mutateAsync({
        ...values,
        frequency: values.recurring ? values.frequency : null,
        startDate: (values.startDate || dayjs()).toDate(),
      })
      formikHelpers.resetForm()
    },
    [transactionCreate],
  )

  return (
    <Formik<FormikTransactionCreateDTO>
      initialValues={{
        amount: 0,
        description: '',
        frequency: Frequency.Monthly,
        recurring: false,
        startDate: dayjs(),
      }}
      onSubmit={onSubmit}
      validateOnBlur
      validateOnChange
      validateOnMount
      validationSchema={validationSchema}
    >
      {(formik) => (
        <Form>
          <Stack spacing={2} alignItems="center">
            {transactionCreate.isPending && <CircularProgress size={80} />}
            {!transactionCreate.isPending && (
              <>
                <FormControl fullWidth error={formik.touched.recurring && Boolean(formik.errors.recurring)}>
                  <FormControlLabel
                    control={
                      <Field
                        component={Switch}
                        type="checkbox"
                        name="recurring"
                        checked={formik.values.recurring}
                        onChange={(_: unknown, checked: boolean) => {
                          formik.setFieldValue('recurring', checked, true)
                        }}
                        aria-describedby="recurring-helper-text"
                      />
                    }
                    label="Recurring"
                  />
                  <FormHelperText id="recurring-helper-text">
                    {(formik.touched.recurring && formik.errors.recurring) || ' '}
                  </FormHelperText>
                </FormControl>
                <FormControl fullWidth error={formik.touched.frequency && Boolean(formik.errors.frequency)}>
                  <Field
                    component={Select}
                    name="frequency"
                    label="Frequency"
                    disabled={!formik.values.recurring}
                    aria-describedby="frequency-helper-text"
                  >
                    {Object.values(Frequency).map((frequency) => (
                      <MenuItem key={frequency} value={frequency}>
                        {frequency}
                      </MenuItem>
                    ))}
                  </Field>
                  <FormHelperText id="frequency-helper-text">
                    {(formik.touched.frequency && formik.errors.frequency) || ' '}
                  </FormHelperText>
                </FormControl>
                <Field
                  as={TextField}
                  fullWidth
                  name="amount"
                  label="Amount"
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={(formik.touched.amount && formik.errors.amount) || ' '}
                  type="number"
                  step="0.01"
                />
                <Field
                  as={TextField}
                  fullWidth
                  name="description"
                  label="Description"
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={(formik.touched.description && formik.errors.description) || ' '}
                />
                <Field
                  component={DatePicker}
                  fullWidth
                  name="startDate"
                  label="Start Date"
                  value={formik.values.startDate}
                  onChange={(value: Dayjs | null) => {
                    formik.setFieldValue('startDate', dayjs.isDayjs(value) ? value : null, true)
                  }}
                  slotProps={{
                    textField: {
                      error: formik.touched.startDate && Boolean(formik.errors.startDate),
                      fullWidth: true,
                      helperText: formik.touched.startDate && formik.errors.startDate,
                    },
                  }}
                />
                <Button color="primary" variant="contained" fullWidth type="submit">
                  Add
                </Button>
              </>
            )}
          </Stack>
        </Form>
      )}
    </Formik>
  )
}
