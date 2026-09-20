import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { FastifyBaseLogger } from 'fastify'
import { IncomingMessage } from 'http'
import { Http2ServerRequest } from 'http2'
import { nanoid } from 'nanoid'
import { Logger } from 'nestjs-pino'

import { AppModule } from './app.module'
import { HttpExceptionFilter } from './filters'
import { logger } from './logger'

export async function bootstrap(init?: boolean): Promise<INestApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId: (req: IncomingMessage | Http2ServerRequest) =>
        (Array.isArray(req.headers['x-trace-id']) ? req.headers['x-trace-id'][0] : req.headers['x-trace-id']) ||
        nanoid(),
      // fastify's bundled pino types can drift a major version from our own pino dependency;
      // the logger instance is still a valid pino logger at runtime.
      logger: logger as unknown as FastifyBaseLogger,
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

  if (init) {
    await app.init()
  }

  return app
}
