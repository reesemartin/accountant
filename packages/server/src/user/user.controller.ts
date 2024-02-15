import { BadRequestException, Body, Controller, Logger, Param, Patch, Req, UseGuards } from '@nestjs/common'

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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() body: UserUpdateDTO, @Req() req: Request) {
    if (!id) {
      throw new BadRequestException('User ID is required')
    }

    if (req.user.id !== Number(id)) {
      throw new BadRequestException('You can only update your own user')
    }

    return this.userService.update({
      ...body,
      id: Number(id),
    })
  }
}
