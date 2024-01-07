import { Module } from '@nestjs/common'

import { LoggerModule } from 'nestjs-pino'
import { PrismaModule } from 'nestjs-prisma'

import { HealthController } from './health/health.controller'

@Module({
  controllers: [HealthController],
  imports: [
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
  ],
  providers: [],
})
export class AppModule {}
