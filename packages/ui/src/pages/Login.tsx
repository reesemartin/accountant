import { Button, CircularProgress, Unstable_Grid2 as Grid, Stack, styled, TextField } from '@mui/material'

import { Field, Form, Formik } from 'formik'
import { FC, useCallback, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as yup from 'yup'

import { LoginParams, useAuthLogin } from '../hooks'
import { AuthService } from './../services'

const validationSchema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

const StyledLogoBox = styled('img')({
  maxWidth: '100%',
  width: 150,
})

export const Login: FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const login = useAuthLogin()

  const onSubmit = useCallback(async (values: LoginParams) => {
    await login.mutateAsync(values)

    navigate(searchParams.get('redirect') || '/')
  }, [])

  useEffect(() => {
    if (AuthService.getAccessToken()) {
      navigate(searchParams.get('redirect') || '/')
    }
  }, [])

  return (
    <Grid alignItems="center" container height="100vh" justifyContent="center" spacing={4} width="100vw">
      <Grid xs={12} sm={8}>
        <Formik
          initialValues={{
            email: '',
            password: '',
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
                {(login.isPending || login.isSuccess) && <CircularProgress size={80} />}
                {!login.isPending && !login.isSuccess && (
                  <>
                    <StyledLogoBox alt="Accountant" src="/favicon.png" />
                    <Field
                      as={TextField}
                      fullWidth
                      name="email"
                      label="Email"
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={(formik.touched.email && formik.errors.email) || ' '}
                    />
                    <Field
                      as={TextField}
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={(formik.touched.password && formik.errors.password) || ' '}
                    />
                    <Button color="primary" variant="contained" fullWidth type="submit">
                      Login
                    </Button>
                  </>
                )}
              </Stack>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  )
}
