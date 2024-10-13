import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UseConfigModule } from './core/Configuration/configModule';
import { UseTypeOrmModule } from './core/database/dataSource';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from 'src/mailer/mailer.module';
import { AuthGuard } from './auth/guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
@Module({
  imports: [
    UseConfigModule,
    UseTypeOrmModule,
    CacheModule.register({
      ttl: 600,
      isGlobal: true
    }),
    AuthModule,
    MailerModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '900s' },
    }),
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
})
export class AppModule { }
