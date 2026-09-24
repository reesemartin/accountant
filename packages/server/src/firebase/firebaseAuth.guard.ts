import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'

import { Auth } from 'firebase-admin/auth'

import { FIREBASE_AUTH } from './firebase.module'

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(@Inject(FIREBASE_AUTH) private firebaseAuth: Auth) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, unknown>; user?: unknown }>()
    const authHeader = request.headers.authorization
    const token =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : undefined

    if (!token) {
      throw new UnauthorizedException('Missing authentication token')
    }

    try {
      const decoded = await this.firebaseAuth.verifyIdToken(token)
      request.user = { email: decoded.email, id: decoded.uid }
      return true
    } catch {
      throw new UnauthorizedException('Invalid or expired authentication token')
    }
  }
}
