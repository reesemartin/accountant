import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class RegisterDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  name?: string

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string
}

export class LoginDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string
}
