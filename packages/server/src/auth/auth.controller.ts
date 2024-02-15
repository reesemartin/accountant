import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Ip,
  Logger,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { Request } from 'express'
import { PrismaService } from 'nestjs-prisma'

import { UserService } from './../user/user.service'
import { LoginDTO, RegisterDTO } from './auth.model'
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
  async register(@Body() body: RegisterDTO) {
    if (await this.userService.findOne({ email: body.email })) {
      throw new BadRequestException('Email already in use')
    }

    const salt = genSaltSync(10)
    const hashedPassword = hashSync(body.password, salt)

    const user = await this.userService.create({
      balance: new Decimal(0),
      email: body.email,
      name: body.name || null,
      password: hashedPassword,
    })

    if (!user) {
      throw new Error('Failed to register user')
    }

    const tokens = await this.authService.getTokens({ email: user.email, userId: user.id })
    await this.userService.update({ id: user.id, refreshToken: hashSync(tokens.refreshToken, salt) })

    return {
      ...this.formatUser(user),
      tokens,
    }
  }

  @Post('login')
  async login(@Body() body: LoginDTO, @Ip() ip?: string) {
    const user = await this.userService.findOne({ email: body.email })

    if (!user) {
      throw new BadRequestException('Invalid credentials')
    }

    if (ip && (await this.authService.checkIpLockout({ ip, userId: user.id }))) {
      throw new ForbiddenException('Too many failed login attempts')
    }

    if (!compareSync(body.password, user.password)) {
      if (ip) {
        await this.prisma.loginAttempt.create({
          data: {
            ip,
            success: false,
            userId: user.id,
          },
        })
      }
      throw new BadRequestException('Invalid credentials')
    }

    const tokens = await this.authService.getTokens({ email: user.email, userId: user.id })
    await this.userService.update({ id: user.id, refreshToken: hashSync(tokens.refreshToken, genSaltSync(10)) })

    try {
      await this.prisma.loginAttempt.create({
        data: {
          ip,
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
    await this.userService.update({ id: req.user?.id, refreshToken: null })
    return true
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    const user = req.user?.id ? await this.userService.findOne({ id: req.user.id }) : undefined

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.formatUser(user)
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refreshTokens(@Req() req: Request) {
    const user = await this.userService.findOne({ id: req.user.id })
    if (!user || !user.refreshToken) throw new ForbiddenException('Invalid refresh token')

    const refreshTokenMatches = compareSync(req.user.refreshToken, user.refreshToken)
    if (!refreshTokenMatches) throw new ForbiddenException('Invalid refresh token')

    const tokens = await this.authService.getTokens({ email: user.email, userId: user.id })
    await this.userService.update({ id: user.id, refreshToken: hashSync(tokens.refreshToken, genSaltSync(10)) })

    return tokens
  }

  formatUser(user: User) {
    return {
      balance: Number(user.balance),
      createdAt: user.createdAt,
      email: user.email,
      id: user.id,
      name: user.name,
    }
  }
}
