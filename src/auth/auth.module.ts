import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { jwtConstants } from './constants';

@Module({
  imports: [UserModule,
    MailerModule,
 
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
