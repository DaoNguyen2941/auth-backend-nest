
import { PartialType, OmitType, PickType } from '@nestjs/mapped-types'
import { Expose, Transform } from 'class-transformer';
import { IsString, IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @Expose()
  @IsString()
  account: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Expose()
  @IsEmail()
  email: string;
}

export class RegisterResponseDto extends OmitType(RegisterDto, ['password'] as const) { }

export class ConfirmOtpDto extends PickType(RegisterDto,['email'] as const) {
  @Expose()
  @IsString()
  OTP: string;
}

export class LoginDto extends OmitType(RegisterDto, ['email' ] as const) { }
