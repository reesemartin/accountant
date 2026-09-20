import { Expose } from 'class-transformer'
import { IsDefined, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

const ORDERABLE_FIELDS = ['name', 'balance', 'createdAt'] as const

export class BankAccountFindManyDTO {
  @IsOptional()
  @IsString()
  name?: string

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
  balance?: number

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string
}
