import { Decimal } from '@prisma/client/runtime/library'

import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator'

export class UserUpdateDTO {
  @IsOptional()
  @IsNumber()
  balance?: Decimal

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  name?: string
}
