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
  async analyze(@UploadedFile() file: Express.Multer.File) {
    return this.analyzeService.create(file);
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
  ) {
    return this.analyzeService.compare(file, body);
  }
}
