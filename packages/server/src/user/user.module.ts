import { Module } from '@nestjs/common'

import { PrismaModule } from 'nestjs-prisma'

import { UserService } from './user.service'

@Module({
  controllers: [],
  exports: [UserService],
  imports: [PrismaModule],
  providers: [UserService],
})
export class UserModule {}
