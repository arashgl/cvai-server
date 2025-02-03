import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { OpenAIService } from './openai.service';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [UtilsModule],
  providers: [
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        return new OpenAI({
          baseURL: configService.getOrThrow('AVALAI_URL'),
          apiKey: configService.getOrThrow('AVALAI_API_KEY'),
        });
      },
      inject: [ConfigService],
    },
    OpenAIService,
  ],
  exports: [OpenAI, OpenAIService],
})
export class OpenAIModule {}
