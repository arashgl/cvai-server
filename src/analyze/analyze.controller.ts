import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalyzeService } from './analyze.service';
import { CompareDto } from './dto/analyze.dto';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { User } from '@lib/shared';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 10,
      },
    }),
  )
  async analyze(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return this.analyzeService.create(file, user);
  }

  @Post('compare')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 10,
      },
    }),
  )
  async compare(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CompareDto,
    @GetUser() user: User,
  ) {
    return this.analyzeService.compare(file, body, user);
  }
}
