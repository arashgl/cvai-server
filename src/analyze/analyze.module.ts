import { Module } from '@nestjs/common';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';
import { OpenAIModule } from '../openai/openai.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [OpenAIModule, UtilsModule],
  controllers: [AnalyzeController],
  providers: [AnalyzeService],
})
export class AnalyzeModule {}
