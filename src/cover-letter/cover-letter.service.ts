import { User } from '@lib/shared/database/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { ChatCompletionChunk } from 'openai/resources/chat/completions';
import { Stream } from 'openai/streaming';
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

  async saveCoverLetter(
    res: Stream<ChatCompletionChunk> & {
      _request_id?: string | null;
    },
    user: User,
    jobDescription: string,
  ) {
    let fullResponse = '';
    try {
      for await (const chunk of res) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
      }

      await this.resumeService.create({
        name: 'Cover Letter',
        content: jobDescription,
        user_id: user.id,
        result: { content: fullResponse },
      });
    } catch (e) {
      Logger.error(e, 'ResumeCreateErrorCVLetter');
    }
  }

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

    this.saveCoverLetter(res, user, jobDescription).catch((e) => {
      Logger.error(e, 'StreamProcessingError');
    });

    return res;
  }
}
