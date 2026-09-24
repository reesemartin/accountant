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

export enum Frequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
  BiWeekly = 'BiWeekly',
  Monthly = 'Monthly',
  BiMonthly = 'BiMonthly',
  Annually = 'Annually',
}

const ORDERABLE_FIELDS = ['description', 'amount', 'startDate', 'createdAt'] as const

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
  @IsIn(ORDERABLE_FIELDS, {
    message: `Must be a valid field: ${ORDERABLE_FIELDS.join(', ')}`,
  })
  orderBy?: (typeof ORDERABLE_FIELDS)[number]

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
  @IsEnum(Frequency, {
    message: `Must be a valid frequency: ${Object.values(Frequency).join(', ')}`,
  })
  frequency?: Frequency

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
  @IsEnum(Frequency, {
    message: `Must be a valid frequency: ${Object.values(Frequency).join(', ')}`,
  })
  frequency?: Frequency

  @IsOptional()
  @IsBoolean()
  recurring?: boolean

  @IsOptional()
  @IsDateString()
  startDate?: string
}
