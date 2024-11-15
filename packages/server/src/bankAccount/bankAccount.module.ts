import { Module } from '@nestjs/common'

import { PrismaModule } from 'nestjs-prisma'

import { BankAccountController } from './bankAccount.controller'
import { BankAccountService } from './bankAccount.service'

@Module({
  controllers: [BankAccountController],
  exports: [BankAccountService],
  imports: [PrismaModule],
  providers: [BankAccountService],
})
export class BankAccountModule {}
