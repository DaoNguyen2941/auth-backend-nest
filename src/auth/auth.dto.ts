
import { PartialType, OmitType, PickType } from '@nestjs/mapped-types'
import { IsString, IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class RegisterDto {
    account: string;
    password: string;
    email: string;
  }

  export class RegisterResponseDto extends PickType(RegisterDto, ['account'] as const) {}
