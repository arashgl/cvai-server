import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { OpenAIService } from './openai.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UtilsModule],
  providers: [
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        return new OpenAI({
          baseURL: configService.getOrThrow('OPENROUTER_URL'),
          apiKey: configService.getOrThrow('OPENROUTER_API_KEY'),
        });
      },
      inject: [ConfigService],
    },
    OpenAIService,
  ],
  exports: [OpenAI, OpenAIService],
})
export class OpenAIModule {}
