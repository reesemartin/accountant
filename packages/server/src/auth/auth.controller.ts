import { Controller, Get, HttpException, HttpStatus, Logger, Post, Req, UseGuards } from '@nestjs/common'
import { User } from '@prisma/client'

import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { Request } from 'express'
import { PrismaService } from 'nestjs-prisma'

import { UserService } from './../user/user.service'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwtAuth.guard'
import { RefreshTokenGuard } from './refreshToken.guard'

@Controller('api/v1/auth')
export class AuthController {
  private readonly logger: Logger

  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
    private userService: UserService,
  ) {
    this.logger = new Logger(AuthController.name)
  }

  @Post('register')
  async register(@Req() req: Request<{ name?: string; email: string; password: string }>) {
    if (!req.body.email) {
      throw new HttpException('Email cannot be empty', HttpStatus.BAD_REQUEST)
    }
    if (!req.body.password) {
      throw new HttpException('Password cannot be empty', HttpStatus.BAD_REQUEST)
    }

    if (await this.userService.findOne({ email: req.body.email })) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST)
    }

    const salt = genSaltSync(10)
    const hashedPassword = hashSync(req.body.password, salt)

    const user = await this.userService.create({
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
    })

    if (!user) {
      throw new HttpException('Failed to register user', HttpStatus.INTERNAL_SERVER_ERROR)
    }

    const tokens = await this.authService.getTokens({ email: user.email, userId: user.id })
    await this.userService.update({ id: user.id, refreshToken: hashSync(tokens.refreshToken, salt) })

    return {
      ...this.formatUser(user),
      tokens,
    }
  }

  @Post('login')
  async login(@Req() req: Request<{ email: string; password: string }>) {
    if (!req.body.email) {
      throw new HttpException('Email cannot be empty', HttpStatus.BAD_REQUEST)
    }
    if (!req.body.password) {
      throw new HttpException('Password cannot be empty', HttpStatus.BAD_REQUEST)
    }

    const user = await this.userService.findOne({ email: req.body.email })

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST)
    }

    if (req.ip && (await this.authService.checkIpLockout({ ip: req.ip, userId: user.id }))) {
      throw new HttpException('Too many failed login attempts', HttpStatus.FORBIDDEN)
    }

    if (!compareSync(req.body.password, user.password)) {
      if (req.ip) {
        await this.prisma.loginAttempt.create({
          data: {
            ip: req.ip,
            success: false,
            userId: user.id,
          },
        })
      }
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST)
    }

    const tokens = await this.authService.getTokens({ email: user.email, userId: user.id })
    await this.userService.update({ id: user.id, refreshToken: hashSync(tokens.refreshToken, genSaltSync(10)) })

    try {
      await this.prisma.loginAttempt.create({
        data: {
          ip: req.ip,
          success: true,
          userId: user.id,
        },
      })
    } catch (error) {
      // we don't prevent logging in just because we fail to log the attempt
      this.logger.error(error)
    }

    return {
      ...this.formatUser(user),
      tokens,
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    await this.userService.update({ id: req.user?.userId, refreshToken: null })
    return true
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    const user = req.user?.userId ? await this.userService.findOne({ id: req.user.userId }) : undefined

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return this.formatUser(user)
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@Req() req: Request) {
    const user = await this.userService.findOne({ id: req.user.userId })
    if (!user || !user.refreshToken) throw new HttpException('Invalid refresh token', HttpStatus.FORBIDDEN)

    const refreshTokenMatches = compareSync(req.user.refreshToken, user.refreshToken)
    if (!refreshTokenMatches) throw new HttpException('Invalid refresh token', HttpStatus.FORBIDDEN)

    const tokens = await this.authService.getTokens({ email: user.email, userId: user.id })
    await this.userService.update({ id: user.id, refreshToken: hashSync(tokens.refreshToken, genSaltSync(10)) })

    return tokens
  }

  formatUser(user: User) {
    return {
      createdAt: user.createdAt,
      email: user.email,
      id: user.id,
      name: user.name,
    }
  }
}
