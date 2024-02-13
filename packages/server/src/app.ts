import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { IncomingMessage } from 'http'
import { Http2ServerRequest } from 'http2'
import { nanoid } from 'nanoid'
import { Logger } from 'nestjs-pino'
import { PrismaService } from 'nestjs-prisma'

import { AppModule } from './app.module'
import { env } from './env'
import { HttpExceptionFilter } from './filters'
import { logger } from './logger'

export async function bootstrap(init?: boolean): Promise<INestApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId: (req: IncomingMessage | Http2ServerRequest) =>
        (Array.isArray(req.headers['x-trace-id']) ? req.headers['x-trace-id'][0] : req.headers['x-trace-id']) ||
        nanoid(),
      logger,
      trustProxy: true,
    }),
    {
      bufferLogs: true,
    },
  )
  app.useLogger(app.get(Logger))

  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new BadRequestException(errors[0]?.constraints?.[Object.keys(errors[0].constraints)[0]])
      },
      stopAtFirstError: true,
      whitelist: true,
    }),
  )
  app.useGlobalFilters(new HttpExceptionFilter())

  app.flushLogs()

  app.enableShutdownHooks()

  const prismaService: PrismaService = app.get(PrismaService)
  prismaService.$on('query', (event: Record<string, unknown>) => {
    if (!env.LOG_QUERIES) return
    logger.debug(event)
  })

  if (init) {
    await app.init()
  }

  return app
}
