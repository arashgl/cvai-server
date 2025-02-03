import { Injectable } from '@nestjs/common';
import { OpenAIService } from 'src/openai/openai.service';
import { CompareDto } from './dto/analyze.dto';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class AnalyzeService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly utilsService: UtilsService,
  ) {}

  async create(file: Express.Multer.File) {
    try {
      const opmtimizedBuffers = await this.utilsService.handleFile(file);
      // Send to OpenAI for analysis
      return this.openaiService.analyzeImage(opmtimizedBuffers);
    } catch (error) {
      throw new Error(`Failed to analyze PDF: ${error.message}`);
    }
  }

  async compare(file: Express.Multer.File, body: CompareDto) {
    const opmtimizedBuffers = await this.utilsService.handleFile(file);
    return this.openaiService.compareResumeWithJobDescription(
      opmtimizedBuffers,
      body.jobDescription,
    );
  }
}
