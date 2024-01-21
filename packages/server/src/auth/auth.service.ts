import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { env } from './../env'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async getTokens(payload: { email?: string; userId?: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          email: payload.email,
          sub: payload.userId,
        },
        {
          expiresIn: '5m',
          secret: env.JWT_SECRET,
        },
      ),
      this.jwtService.signAsync(
        {
          email: payload.email,
          sub: payload.userId,
        },
        {
          expiresIn: '7d',
          secret: env.REFRESH_JWT_SECRET,
        },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}
