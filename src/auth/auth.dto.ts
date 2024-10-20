
import { PartialType, OmitType, PickType } from '@nestjs/mapped-types'
import { Expose, Transform } from 'class-transformer';
import { IsString, IsEmail, IsInt, IsNotEmpty, isNumber, IsNumber } from 'class-validator';
import { BasicUserDataDto, userDataDto } from 'src/user/user.dto';
import { Request } from 'express';
export class RegisterDto {

  @Expose()
  @IsNotEmpty()
  @IsString()
  account: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class JWTPayload {
  @Expose()
  @IsNotEmpty()
  @IsString()
  account: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  sub: string;
}

export class JWTDecoded extends JWTPayload {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  iat: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  exp: number;
}

export class CustomUserInRequest extends Request {
  @Expose()
  user: userDataDto
}

export class LoginResponseDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  access_token: string;

  @Expose()
  @IsNotEmpty()
  @IsNotEmpty()
  userData: userDataDto
}

export class RegisterResponseDto extends OmitType(RegisterDto, ['password'] as const) { }

export class ConfirmOtpDto extends PickType(RegisterDto, ['email'] as const) {
  @Expose()
  @IsString()
  OTP: string;
}

export class LoginDto extends OmitType(RegisterDto, ['email'] as const) { }
