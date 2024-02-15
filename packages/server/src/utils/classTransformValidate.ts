import { BadRequestException } from '@nestjs/common'

import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

export async function classTransformValidate<T extends object>(
  classType: new () => T,
  _event: Record<string, unknown>,
): Promise<T> {
  // for some reason plainToInstance is not working with boolean values
  // and the string 'true' or 'false' is always returned as true so we have to manually convert them
  const booleanEvent = Object.entries(_event).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value === 'true' ? true : value === 'false' ? false : value,
    }),
    {} as Record<string, unknown>,
  )
  // now that we know that the boolean values are correct we can use plainToInstance
  const event = plainToInstance(classType, booleanEvent, {
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
