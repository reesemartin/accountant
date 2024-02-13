import { $Enums, Prisma, Transaction } from '@prisma/client'

import { Expose } from 'class-transformer'
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class TransactionFindManyDTO {
  @Expose()
  @IsOptional()
  @IsBoolean()
  disabled?: boolean

  @Expose()
  @IsOptional()
  @IsDateString()
  end?: string

  @Expose()
  @IsOptional()
  @IsEnum(Prisma.TransactionScalarFieldEnum, {
    message: 'Must be a valid field from the Transaction object',
  })
  orderBy?: keyof Transaction

  @Expose()
  @IsOptional()
  @IsIn(['asc', 'desc', 'ASC', 'DESC'])
  orderByDirection?: 'asc' | 'desc' | 'ASC' | 'DESC'

  @Expose()
  @IsOptional()
  @IsBoolean()
  recurring?: boolean

  @Expose()
  @IsOptional()
  @IsInt()
  skip?: number

  @Expose()
  @IsOptional()
  @IsDateString()
  start?: string

  @Expose()
  @IsOptional()
  @IsInt()
  take?: number
}

export class TransactionCreateDTO {
  @IsDefined()
  @IsNumber()
  amount: number

  @IsNotEmpty()
  @IsString()
  description: string

  @IsOptional()
  @IsBoolean()
  disabled?: boolean

  @IsOptional()
  @IsEnum($Enums.Frequency, {
    message: `Must be a valid frequency: ${Object.values($Enums.Frequency).join(', ')}`,
  })
  frequency?: $Enums.Frequency

  @IsOptional()
  @IsBoolean()
  recurring?: boolean

  @IsNotEmpty()
  @IsDateString()
  startDate: string
}

export class TransactionUpdateDTO {
  @IsOptional()
  @IsNumber()
  amount?: number

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsBoolean()
  disabled?: boolean

  @IsOptional()
  @IsEnum($Enums.Frequency, {
    message: `Must be a valid frequency: ${Object.values($Enums.Frequency).join(', ')}`,
  })
  frequency?: $Enums.Frequency

  @IsOptional()
  @IsBoolean()
  recurring?: boolean

  @IsOptional()
  @IsDateString()
  startDate?: string
}
