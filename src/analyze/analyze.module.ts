import { Module } from '@nestjs/common';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';
import { OpenAIModule } from '../openai/openai.module';
import { UtilsModule } from 'src/utils/utils.module';
import { ResumeService } from './resume.service';
import { DatabaseModule } from '@lib/shared/database/database.module';

@Module({
  imports: [OpenAIModule, UtilsModule, DatabaseModule],
  controllers: [AnalyzeController],
  providers: [AnalyzeService, ResumeService],
  exports: [ResumeService],
})
export class AnalyzeModule {}
