export class AuthService {
  static getAccessToken() {
    return localStorage.getItem('accessToken')
  }

  static setAccessToken(token: string | null) {
    if (!token) {
      localStorage.removeItem('accessToken')
      return
    }
    localStorage.setItem('accessToken', token)
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
