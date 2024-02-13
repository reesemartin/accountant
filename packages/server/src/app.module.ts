import { Module } from '@nestjs/common'

import { LoggerModule } from 'nestjs-pino'
import { PrismaModule } from 'nestjs-prisma'

import { AuthModule } from './auth/auth.module'
import { HealthController } from './health/health.controller'
import { TransactionModule } from './transaction/transaction.module'
import { UserModule } from './user/user.module'

@Module({
  controllers: [HealthController],
  imports: [
    AuthModule,
    UserModule,
    LoggerModule.forRoot({
      exclude: ['/api/v1/health'],
      pinoHttp: {
        autoLogging: true,
      },
      useExisting: true,
    }),
    PrismaModule.forRoot({
      prismaServiceOptions: {
        prismaOptions: {
          log: [
            {
              emit: 'event',
              level: 'query',
            },
          ],
        },
      },
    }),
    TransactionModule,
  ],
  providers: [],
})
export class AppModule {}
