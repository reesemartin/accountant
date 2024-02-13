import { Module } from '@nestjs/common'

import { PrismaModule } from 'nestjs-prisma'

import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'

@Module({
  controllers: [TransactionController],
  exports: [TransactionService],
  imports: [PrismaModule],
  providers: [TransactionService],
})
export class TransactionModule {}
