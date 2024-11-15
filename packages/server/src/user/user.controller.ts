import { Body, Controller, Logger, Patch, Req, UseGuards } from '@nestjs/common'

import { Request } from 'express'

import { JwtAuthGuard } from '../auth/jwtAuth.guard'
import { UserUpdateDTO } from './user.model'
import { UserService } from './user.service'

@Controller('api/v1/user')
export class UserController {
  private readonly logger: Logger

  constructor(private userService: UserService) {
    this.logger = new Logger(UserController.name)
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  async update(@Body() body: UserUpdateDTO, @Req() req: Request) {
    return this.userService.update({
      ...body,
      id: req.user.id,
    })
  }
}
