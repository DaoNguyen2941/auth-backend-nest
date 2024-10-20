import { registerAs } from "@nestjs/config";
import { config } from 'dotenv';

config();
export default registerAs('jwt', () => ({
   tokenSecret: process.env.SECRET_JWT,
   refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
   expirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
  }));