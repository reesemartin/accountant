import { FC } from 'react'
import { Navigate } from 'react-router-dom'

import { AuthService } from './../../services'

type PrivateRouteProps = {
  element: React.ReactNode | null
}
export const PrivateRoute: FC<PrivateRouteProps> = (props) => {
  return !AuthService.checkToken(AuthService.getRefreshToken()) ? (
    <Navigate to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} replace />
  ) : (
    props.element
  )
}
