import { Module } from '@nestjs/common'

import { LoggerModule } from 'nestjs-pino'

import { AuthModule } from './auth/auth.module'
import { BankAccountModule } from './bankAccount/bankAccount.module'
import { FirebaseModule } from './firebase/firebase.module'
import { HealthController } from './health/health.controller'
import { TransactionModule } from './transaction/transaction.module'
import { UserModule } from './user/user.module'

@Module({
  controllers: [HealthController],
  imports: [
    AuthModule,
    BankAccountModule,
    FirebaseModule,
    UserModule,
    LoggerModule.forRoot({
      exclude: ['/api/v1/health'],
      pinoHttp: {
        autoLogging: true,
      },
      useExisting: true,
    }),
    TransactionModule,
  ],
  providers: [],
})
export class AppModule {}
