import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Button, CircularProgress, CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material'
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import AppTheme from './App.theme'
import { AppRouter } from './router'

// react query defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 mins
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={AppTheme}>
        <CssBaseline />
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ resetErrorBoundary }) => (
                <Stack alignItems="center" height="100vh" justifyContent="center" width="100vw">
                  <Typography>There was an error!</Typography>
                  <Button onClick={resetErrorBoundary}>Try again</Button>
                </Stack>
              )}
            >
              <Suspense
                fallback={
                  <Stack alignItems="center" height="100vh" justifyContent="center" width="100vw">
                    <CircularProgress />
                  </Stack>
                }
              >
                <AppRouter />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
