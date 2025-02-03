import { Module } from '@nestjs/common';
import { OpenAIModule } from './openai/openai.module';
import { AnalyzeModule } from './analyze/analyze.module';
import { ConfigModule } from '@nestjs/config';
import { CoverLetterModule } from './cover-letter/cover-letter.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OpenAIModule,
    AnalyzeModule,
    CoverLetterModule,
    UtilsModule,
  ],
})
export class AppModule {}
