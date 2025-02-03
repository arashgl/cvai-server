import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './services/auth.service';
import { JwtServiceFactory } from './services/jwt.factory';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';
import { NotificationModule } from '@server/notification/notification.module';
import { EmailModule } from '@server/email/email.module';
import { GoogleAuthService } from '@server/auth/services/google-auth.service';
import { DatabaseModule } from '@lib/shared/database/database.module';
import { UserModule } from '@server/user/user.module';

@Module({
  imports: [
    PassportModule,
    DatabaseModule,
    UserModule,
    JwtModule.registerAsync({ useClass: JwtServiceFactory }),
    NotificationModule,
    CacheModule.register({ ttl: 600_000 }),
    EmailModule,
  ],
  providers: [AuthService, JwtStrategy, GoogleAuthService],
  exports: [AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
