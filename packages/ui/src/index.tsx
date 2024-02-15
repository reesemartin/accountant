import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

dayjs.extend(isLeapYear)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
