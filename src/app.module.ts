import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UseConfigModule } from './core/Configuration/configModule';
import { UseTypeOrmModule } from './core/database/dataSource';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UseConfigModule,
    UseTypeOrmModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
