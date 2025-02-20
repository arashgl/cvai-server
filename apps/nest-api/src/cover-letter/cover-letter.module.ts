import { Module } from '@nestjs/common';
import { CoverLetterService } from './cover-letter.service';
import { CoverLetterController } from './cover-letter.controller';
import { UtilsModule } from '../utils/utils.module';
import { OpenAIModule } from '../openai/openai.module';
import { AnalyzeModule } from '../analyze/analyze.module';

@Module({
  imports: [UtilsModule, OpenAIModule, AnalyzeModule],
  controllers: [CoverLetterController],
  providers: [CoverLetterService],
})
export class CoverLetterModule {}
