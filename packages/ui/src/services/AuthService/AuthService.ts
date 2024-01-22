import { ApiQueryService } from '../ApiQueryService/ApiQueryService'
import { User, UserWithAuth } from './../../models/user.model'

export class AuthService {
  static async login(params: { email: string; password: string }) {
    return await new ApiQueryService().post<UserWithAuth>({
      data: params,
      endpoint: `api/v1/auth/login`,
    })
  }

  static async logout() {
    return await new ApiQueryService().post<boolean>({
      endpoint: `api/v1/auth/logout`,
    })
  }

  static async me() {
    return await new ApiQueryService().get<User>({
      endpoint: `api/v1/auth/me`,
    })
  }

  static getAccessToken() {
    return sessionStorage.getItem('accessToken')
  }

  static setAccessToken(token: string | null) {
    if (!token) {
      sessionStorage.removeItem('accessToken')
      return
    }
    sessionStorage.setItem('accessToken', token)
  }

  static getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  static setRefreshToken(token: string | null) {
    if (!token) {
      localStorage.removeItem('refreshToken')
      return
    }
    localStorage.setItem('refreshToken', token)
  }

  static checkToken(token?: string | null) {
    if (!token) {
      return false
    }
    let decodedToken
    try {
      decodedToken = JSON.parse(atob(token.split('.')[1]))
    } catch (error) {
      return false
    }
    if (decodedToken.exp * 1000 < Date.now()) {
      return false
    }
    return true
  }
}
