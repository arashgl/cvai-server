import { Module } from '@nestjs/common';
import { CoverLetterService } from './cover-letter.service';
import { CoverLetterController } from './cover-letter.controller';
import { UtilsModule } from 'src/utils/utils.module';
import { OpenAIModule } from 'src/openai/openai.module';
import { AnalyzeModule } from 'src/analyze/analyze.module';

@Module({
  imports: [UtilsModule, OpenAIModule, AnalyzeModule],
  controllers: [CoverLetterController],
  providers: [CoverLetterService],
})
export class CoverLetterModule {}
