import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => ({
   secret: process.env.SECRET_JWT
  }));