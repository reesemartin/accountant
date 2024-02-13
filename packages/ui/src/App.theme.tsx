import { createTheme } from '@mui/material'
import { grey } from '@mui/material/colors'

const AppTheme = createTheme({
  components: {
    MuiGrid2: {
      styleOverrides: {
        root: {
          margin: 0,
        },
      },
    },
  },
  palette: {
    error: { contrastText: '#000', main: '#ec6458' },
    mode: 'dark',
    primary: { contrastText: '#000', main: '#ff7900' },
    secondary: { contrastText: '#fff', main: grey[900] },
    success: { contrastText: '#000', main: '#8ec666' },
    text: {
      primary: '#fff',
      secondary: '#fff',
    },
    warning: { contrastText: '#000', main: '#ffc05f' },
  },
})

export default AppTheme
