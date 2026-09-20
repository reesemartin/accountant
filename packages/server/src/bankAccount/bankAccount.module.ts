import { Module } from '@nestjs/common'

import { BankAccountController } from './bankAccount.controller'
import { BankAccountService } from './bankAccount.service'

@Module({
  controllers: [BankAccountController],
  exports: [BankAccountService],
  providers: [BankAccountService],
})
export class BankAccountModule {}
