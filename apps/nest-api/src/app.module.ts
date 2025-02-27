import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { OpenAIModule } from './openai/openai.module';
import { CoverLetterModule } from './cover-letter/cover-letter.module';
import { AnalyzeModule } from './analyze/analyze.module';
import { DatabaseModule } from '@lib/shared/database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule,
    AuthModule,
    OpenAIModule,
    CoverLetterModule,
    AnalyzeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
