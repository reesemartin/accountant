import { IsDefined, IsEmail, IsOptional, IsString } from 'class-validator'

export class RegisterDTO {
  @IsDefined()
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  name?: string

  @IsDefined()
  @IsString()
  password: string
}

export class LoginDTO {
  @IsDefined()
  @IsEmail()
  email: string

  @IsDefined()
  @IsString()
  password: string
}
