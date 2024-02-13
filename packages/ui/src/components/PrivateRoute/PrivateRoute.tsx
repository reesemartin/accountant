import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthService } from './../../services'

type PrivateRouteProps = {
  element: React.ReactNode | null
}
export const PrivateRoute: FC<PrivateRouteProps> = (props) => {
  const navigate = useNavigate()

  const isLoggedIn = AuthService.checkToken(AuthService.getRefreshToken())

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`, { replace: true })
    }
  }, [navigate, isLoggedIn])

  return !isLoggedIn ? null : props.element
}
