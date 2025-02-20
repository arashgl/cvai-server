import { Injectable, Logger } from '@nestjs/common';
import { CompareDto } from './dto/analyze.dto';
import { User } from '@lib/shared';
import { ResumeService } from './resume.service';

import { UtilsService } from '../utils/utils.service';
import { OpenAIService } from '../openai/openai.service';

@Injectable()
export class AnalyzeService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly utilsService: UtilsService,
    private readonly resumeService: ResumeService,
  ) {}

  async create(file: Express.Multer.File, user: User) {
    try {
      const resumeText = await this.utilsService.convertPDFtoText(file);
      // Send to OpenAI for analysis
      const result = await this.openaiService.analyzeImage(resumeText);
      this.resumeService
        .create({
          name: file.originalname,
          content: resumeText,
          result: result,
          user_id: user.id,
        })
        .catch((e) => {
          Logger.error(e, 'ResumeCreateErrorCreate');
        });
      return result;
    } catch (error) {
      throw new Error(`Failed to analyze PDF: ${error.message}`);
    }
  }

  async compare(file: Express.Multer.File, body: CompareDto, user: User) {
    const resumeText = await this.utilsService.convertPDFtoText(file);

    const { result, jobDescription } =
      await this.openaiService.compareResumeWithJobDescription(
        resumeText,
        body.jobDescription,
      );

    this.resumeService
      .create({
        name: file.originalname,
        content: jobDescription,
        result: result,
        user_id: user.id,
      })
      .catch((e) => {
        Logger.error(e, 'ResumeCreateErrorCompare');
      });
    return result;
  }
}
