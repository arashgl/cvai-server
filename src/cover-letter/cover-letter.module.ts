import { Module } from '@nestjs/common';
import { CoverLetterService } from './cover-letter.service';
import { CoverLetterController } from './cover-letter.controller';
import { UtilsModule } from 'src/utils/utils.module';
import { OpenAIModule } from 'src/openai/openai.module';

@Module({
  imports: [UtilsModule, OpenAIModule],
  controllers: [CoverLetterController],
  providers: [CoverLetterService],
})
export class CoverLetterModule {}
