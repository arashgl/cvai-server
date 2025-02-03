import { User } from '@lib/shared/database/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { ResumeService } from 'src/analyze/resume.service';
import { OpenAIService } from 'src/openai/openai.service';
import { UtilsService } from 'src/utils/utils.service';

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
    const formattedReq = await this.utilsService.handleFile(file);

    const res = await this.openaiService.generateCoverLetter(
      formattedReq,
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
