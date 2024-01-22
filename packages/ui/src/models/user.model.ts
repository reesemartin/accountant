export type User = {
  id: string
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
