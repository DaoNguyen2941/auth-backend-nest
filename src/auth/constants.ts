import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

export const jwtConstants = {
    secret:new ConfigService().get<string>('SECRET_JWT'),
    expirationTime: new ConfigService().get<string>('jwt.expirationTime'),
    refreshTokenSecret: new ConfigService().get<string>('jwt.refreshTokenSecret')
  }; 