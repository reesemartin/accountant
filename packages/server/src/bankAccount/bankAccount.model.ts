import { BankAccount, Prisma } from '@prisma/client'

import { Expose } from 'class-transformer'
import { IsDefined, IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class BankAccountFindManyDTO {
  @IsOptional()
  @IsString()
  name?: string

  @Expose()
  @IsOptional()
  @IsEnum(Prisma.BankAccountScalarFieldEnum, {
    message: 'Must be a valid field from the BankAccount object',
  })
  orderBy?: keyof BankAccount

  @Expose()
  @IsOptional()
  @IsIn(['asc', 'desc', 'ASC', 'DESC'])
  orderByDirection?: 'asc' | 'desc' | 'ASC' | 'DESC'

  @Expose()
  @IsOptional()
  @IsInt()
  skip?: number

  @Expose()
  @IsOptional()
  @IsInt()
  take?: number
}

export class BankAccountCreateDTO {
  @IsDefined()
  @IsNumber()
  balance: number

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string
}

export class BankAccountUpdateDTO {
  @IsOptional()
  @IsNumber()
  amount?: number

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string
}
