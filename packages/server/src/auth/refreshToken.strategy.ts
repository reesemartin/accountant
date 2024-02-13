import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { env } from '../env'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: env.REFRESH_JWT_SECRET,
    })
  }

  async validate(req: Request, payload: { sub?: string; email?: string }) {
    return {
      email: payload.email,
      id: payload.sub,
      refreshToken: req.headers?.authorization?.replace('Bearer', '').trim(),
    }
  }
}
