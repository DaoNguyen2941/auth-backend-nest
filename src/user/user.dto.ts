
import { PartialType, OmitType, PickType } from '@nestjs/mapped-types'
import { Expose, Transform } from 'class-transformer';
import { IsString, IsEmail, IsInt, IsNotEmpty } from 'class-validator';
export class BasicUserDataDto
{
    @Expose()
    @IsString()
    id: string;
  
    @Expose()
    @IsString()
    account: string;
  
    @Expose()
    @IsString()
    password: string;

    @Expose()
    @IsEmail()
    email: string;

    @Expose()
    @IsString()
    refresh_token: string;
  }

  export class userDataDto extends OmitType(BasicUserDataDto, ['password', 'refresh_token'] as const) { };

  export class searchAccountOrEmailDto {
    @Expose()
    @IsString()
    keyword: string;
  }