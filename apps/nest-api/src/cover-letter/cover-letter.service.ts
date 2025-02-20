import { User } from '@lib/shared/database/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { ResumeService } from '../analyze/resume.service';
import { OpenAIService } from '../openai/openai.service';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class CoverLetterService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly utilsService: UtilsService,
    private readonly resumeService: ResumeService,
  ) {}

  async generateCoverLetterStream(
    file: Express.Multer.File,
    jobDescription: string,
    user: User,
  ) {
    const resumeText = await this.utilsService.convertPDFtoText(file);

    const res = await this.openaiService.generateCoverLetter(
      resumeText,
      jobDescription,
    );

    this.resumeService
      .create({
        name: 'Cover Letter',
        content: jobDescription,
        user_id: user.id,
        result: { content: 'N/A' },
      })
      .catch((e) => {
        Logger.error(e, 'StreamProcessingError');
      });

    return res;
  }
}
