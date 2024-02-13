import { BadRequestException } from '@nestjs/common'

import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

export async function classTransformValidate<T extends object>(
  classType: new () => T,
  _event: Record<string, unknown>,
): Promise<T> {
  const event = plainToInstance(classType, _event, {
    enableImplicitConversion: true,
  })
  const errors = await validate(event, {
    stopAtFirstError: true,
    whitelist: true,
  })
  if (errors.length) {
    throw new BadRequestException(errors[0]?.constraints?.[Object.keys(errors[0].constraints)[0]])
  }
  return event
}
