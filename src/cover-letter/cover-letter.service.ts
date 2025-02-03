import { Injectable } from '@nestjs/common';
import { OpenAIService } from 'src/openai/openai.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class CoverLetterService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly utilsService: UtilsService,
  ) {}

  async generateCoverLetterStream(
    file: Express.Multer.File,
    jobDescription: string,
  ) {
    const formattedReq = await this.utilsService.handleFile(file);

    return this.openaiService.generateCoverLetter(formattedReq, jobDescription);
  }
}
