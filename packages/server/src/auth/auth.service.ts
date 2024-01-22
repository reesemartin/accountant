import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { PrismaService } from 'nestjs-prisma'

import { env } from './../env'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

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

  async checkIpLockout(params: { userId: number; ip: string }) {
    // select login attempts from the last hour
    const loginAttempts = await this.prisma.loginAttempt.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        createdAt: {
          // 1 hour ago
          gte: new Date(Date.now() - 1000 * 60 * 60),
        },
        ip: params.ip,
        userId: params.userId,
      },
    })
    const successfulLoginAttempt = loginAttempts.find((attempt) => attempt.success)
    // only consider failed attempts after the last successful attempt if there was one
    const consideredLoginAttempts = loginAttempts.filter(
      (attempt) =>
        !attempt.success && (!successfulLoginAttempt || attempt.createdAt > successfulLoginAttempt.createdAt),
    )
    // if there are more than 5 attempts, they are locked out
    return consideredLoginAttempts.length >= 5
  }
}
