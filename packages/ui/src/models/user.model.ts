export type User = {
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
