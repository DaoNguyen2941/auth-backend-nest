import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import databaseConfig from './config/database.config';

export const UseConfigModule = ConfigModule.forRoot({
    load: [databaseConfig],
    isGlobal: true,
    cache: true,
    validationSchema: Joi.object({
      //http
      PORT: Joi.number().required().default(3002),
      //database
      DATABASE_HOST: Joi.string(),
      DATABASE_PORT: Joi.number(),
      DATABASE_NAME: Joi.string().required(),
      DATABASE_USER: Joi.string().required(),
      DATABASE_PASSWORD: Joi.string().required(),
    })
  })