import awsLambdaFastify from '@fastify/aws-lambda'
import { INestApplication } from '@nestjs/common'
import { Handler } from '@netlify/functions'

import { PrismaService } from 'nestjs-prisma'

import { bootstrap } from './app'
import { env } from './env'

let nest: INestApplication

export const handler: Handler = async (event, context) => {
  nest = nest ?? (await bootstrap(true))

  const response = await awsLambdaFastify(nest.getHttpAdapter().getInstance(), {
    callbackWaitsForEmptyEventLoop: false,
    decorateRequest: false,
  })(event, context)

  nest.get(PrismaService).$disconnect()

  return response
}

if (env.NODE_ENV === 'local') {
  void (async () => {
    const nest = await bootstrap()
    await nest.listen(3001, '0.0.0.0')
  })()
}
