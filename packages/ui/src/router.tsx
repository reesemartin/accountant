import { FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AppLayout, PrivateRoute } from './components'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Logout } from './pages/Logout'

export const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}
