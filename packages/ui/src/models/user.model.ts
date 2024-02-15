export type User = {
  balance: number
  id: number
  name: string
  email: string
  createdAt: string
}

export type UserWithAuth = User & {
  tokens: {
    accessToken: string
    refreshToken: string
  }
}
