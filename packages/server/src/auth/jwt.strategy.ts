import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'

import { env } from './../env'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET,
    })
  }

  async validate(payload: { sub?: string; email?: string }) {
    return { email: payload.email, id: payload.sub }
  }
}
