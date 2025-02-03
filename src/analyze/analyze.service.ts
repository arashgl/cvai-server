import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from 'src/openai/openai.service';
import { CompareDto } from './dto/analyze.dto';
import { UtilsService } from 'src/utils/utils.service';
import { User } from '@lib/shared';
import { ResumeService } from './resume.service';

@Injectable()
export class AnalyzeService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly utilsService: UtilsService,
    private readonly resumeService: ResumeService,
  ) {}

  async create(file: Express.Multer.File, user: User) {
    try {
      const opmtimizedBuffers = await this.utilsService.handleFile(file);
      // Send to OpenAI for analysis
      const result = await this.openaiService.analyzeImage(opmtimizedBuffers);

      this.resumeService
        .create({
          name: file.originalname,
          content: result,
          user_id: user.id,
        })
        .catch((e) => {
          Logger.error(e, 'ResumeCreateError');
        });
      return result;
    } catch (error) {
      throw new Error(`Failed to analyze PDF: ${error.message}`);
    }
  }

  async compare(file: Express.Multer.File, body: CompareDto, user: User) {
    const opmtimizedBuffers = await this.utilsService.handleFile(file);

    const { result, jobDescription } =
      await this.openaiService.compareResumeWithJobDescription(
        opmtimizedBuffers,
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
        Logger.error(e, 'ResumeCreateError');
      });
    return result;
  }
}
