import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { CoverLetterService } from './cover-letter.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { User } from '@lib/shared';
import { GetUser } from 'src/auth/decorators/user.decorator';

@Controller('cover-letter')
export class CoverLetterController {
  constructor(private readonly coverLetterService: CoverLetterService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async generateCoverLetter(
    @UploadedFile() file: Express.Multer.File,
    @Body('jobDescription') jobDescription: string,
    @Res() response: Response,
    @GetUser() user: User,
  ) {
    // return this.coverLetterService.generateCoverLetterStream(
    //   file,
    //   jobDescription,
    // );
    // Set headers for SSE
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Connection', 'keep-alive');

    try {
      // Create stream from service
      const stream = await this.coverLetterService.generateCoverLetterStream(
        file,
        jobDescription,
        user,
      );

      // Handle stream using for...await
      try {
        for await (const chunk of stream) {
          response.write(chunk.choices[0]?.delta?.content || '');
        }
        response.end();
      } catch (streamError) {
        console.error('Stream error:', streamError);
        response.end();
      }
    } catch (error) {
      console.error('Error:', error);
      response.end();
    }
  }
}
