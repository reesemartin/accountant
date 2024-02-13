import axios, { AxiosError, CancelToken, isAxiosError } from 'axios'
import axiosRetry from 'axios-retry'

import { AuthService } from './..'

export class ApiQueryService {
  private apiUrl: string

  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001'
    // if the apiUrl ends with a slash, remove it since we add slash before all endpoints
    if (this.apiUrl.endsWith('/')) {
      this.apiUrl = this.apiUrl.slice(0, -1)
    }

    axiosRetry(axios, {
      retries: 3, // number of retries
      retryCondition: (error: AxiosError) => {
        // if retry condition is not specified, by default idempotent requests are retried
        return error?.response?.status === 429
      },
      retryDelay: (retryCount: number, error: AxiosError) => {
        console.error(`retry attempt: ${retryCount}`)
        // Use the x-ratelimit-reset header if present
        const rateLimitReset = error?.response?.headers?.['x-ratelimit-reset']
        if (rateLimitReset && !isNaN(Number(rateLimitReset))) {
          console.error(`ratelimit reset: ${rateLimitReset}`)
          // calc the difference between the current time and the rateLimitReset time
          const currentTime: number = new Date().getTime() / 1000 // convert to seconds to match expected ratelimit reset time
          const secondsTillReset = Number(rateLimitReset) - currentTime
          console.error(`retry after: ${secondsTillReset} seconds`)
          if (secondsTillReset > 0) {
            return retryCount * secondsTillReset * 1000 + 1 // ensure we don't retry until 1 ms after the rate limit reset
          }
        }

        return retryCount * 2000 // time interval between retries default to 2 seconds
      },
    })
  }

  /**
   * You can optionally pass a cancelToken to have requests cancelled if they come in with the same token.
   * You need to create a `const requestCancelSource = axios.CancelToken.source()` and then pass the output's `requestCancelSource.token` property to this function as the cancelToken property of the event.
   * To cancel the request, before calling this method, call the source's cancel method. `requestCancelSource.cancel('cancelToken triggered')`
   */
  public async get<T>(event: {
    endpoint: string
    headers?: Record<string, string>
    cancelToken?: CancelToken
    params?: unknown
  }): Promise<T> {
    await this.tokenCheck()
    const response = await axios
      .get(`${this.apiUrl}${this.formatEndpoint(event.endpoint)}`, {
        cancelToken: event.cancelToken,
        headers: this.setHeaders(event.headers),
        params: event.params,
      })
      .catch((error) => {
        if (error?.message !== 'cancelToken triggered') {
          this.handleError(error)
        }
      })
    return response?.data
  }

  public async post<T>(event: { endpoint: string; data?: unknown; headers?: Record<string, string> }): Promise<T> {
    await this.tokenCheck()
    const response = await axios
      .post(`${this.apiUrl}${this.formatEndpoint(event.endpoint)}`, event.data, {
        headers: this.setHeaders(event.headers),
      })
      .catch(this.handleError)
    return response?.data
  }

  public async patch<T>(event: { endpoint: string; data?: unknown; headers?: Record<string, string> }): Promise<T> {
    await this.tokenCheck()
    const response = await axios
      .patch(`${this.apiUrl}${this.formatEndpoint(event.endpoint)}`, event.data, {
        headers: this.setHeaders(event.headers),
      })
      .catch(this.handleError)
    return response?.data
  }

  public async delete<T>(event: { endpoint: string; headers?: Record<string, string> }): Promise<T> {
    await this.tokenCheck()
    const response = await axios
      .delete(`${this.apiUrl}${this.formatEndpoint(event.endpoint)}`, {
        headers: this.setHeaders(event.headers),
      })
      .catch(this.handleError)
    return response?.data
  }

  private handleError(error: AxiosError | Error): void {
    if (isAxiosError(error)) {
      if (!error.status || error.status < 400 || error.status >= 500) {
        console.error(error)
        throw new Error('Sorry, there was a problem with your request.')
      }
      console.warn(error)
      throw (
        error.response?.data ||
        error.message ||
        error.response?.statusText ||
        'Sorry, there was a problem with your request.'
      )
    }
    throw error.message || 'Sorry, there was a problem with your request.'
  }

  private formatEndpoint(endpoint: string): string {
    // enforce leading slash
    if (!endpoint.startsWith('/')) {
      endpoint = `/${endpoint}`
    }
    return endpoint
  }

  private async tokenCheck() {
    const refreshToken = AuthService.getRefreshToken()
    if (!refreshToken) {
      // not logged in so nothing to refresh
      return
    }

    if (!AuthService.checkToken(refreshToken)) {
      // refresh token is expired so don't try refreshing
      // TODO: Trigger logout
      return
    }

    if (!AuthService.checkToken(AuthService.getAccessToken())) {
      await this.refreshTokens()
    }
  }

  private async refreshTokens() {
    const response = await axios
      .get<{
        accessToken: string
        refreshToken: string
      }>(`${this.apiUrl}/api/v1/auth/refresh`, {
        headers: this.setHeaders({
          Authorization: `Bearer ${AuthService.getRefreshToken()}`,
        }),
      })
      .catch(this.handleError)
    if (!response?.data?.accessToken || !response?.data?.refreshToken) {
      throw new Error('Unable to refresh tokens')
    }
    AuthService.setAccessToken(response.data.accessToken)
    AuthService.setRefreshToken(response.data.refreshToken)
  }

  private setHeaders(headers?: Record<string, string>): Record<string, string> {
    const accessToken = AuthService.getAccessToken()
    return {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      'Content-Type': 'application/json',
      ...headers,
    }
  }
}
