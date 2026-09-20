import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common'

import { Request } from 'express'

import { FirebaseAuthGuard } from './../firebase/firebaseAuth.guard'
import { UserService } from './../user/user.service'

@Controller('api/v1/auth')
export class AuthController {
  private readonly logger: Logger

  constructor(private userService: UserService) {
    this.logger = new Logger(AuthController.name)
  }

  /**
   * Sessions are Firebase ID tokens verified per-request by FirebaseAuthGuard, so
   * "logging in" is just ensuring a Firestore profile exists for the verified uid.
   */
  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  async me(@Req() req: Request) {
    const user = await this.userService.getOrCreate({ email: req.user?.email, id: req.user!.id })
    return this.userService.formatUser(user)
  }
}
