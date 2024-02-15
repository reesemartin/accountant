import { Module } from '@nestjs/common'

import { PrismaModule } from 'nestjs-prisma'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [PrismaModule],
  providers: [UserService],
})
export class UserModule {}
