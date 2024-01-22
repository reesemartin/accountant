import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { PrismaModule } from 'nestjs-prisma'

import { env } from './../env'
import { UserModule } from './../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { RefreshTokenStrategy } from './refreshToken.strategy'

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '300s' },
    }),
    PrismaModule,
    PassportModule,
    UserModule,
  ],
  providers: [JwtStrategy, RefreshTokenStrategy, AuthService],
})
export class AuthModule {}
