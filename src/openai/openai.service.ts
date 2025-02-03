import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  ANALYZE_RESUME_PROMPT,
  COMPARE_RESUME_WITH_JOB_DESCRIPTION_PROMPT,
  GENERATE_COVER_LETTER_PROMPT,
  GENERATE_COVER_LETTER_USER_PROMPT,
} from './prompts.const';
import { ChatCompletionContentPartText } from 'openai/resources/chat/completions';

@Injectable()
export class OpenAIService {
  constructor(private readonly openai: OpenAI) {}

  async analyzeImage(imageBuffer: Buffer[]) {
    try {
      const formattedReq = this.formatPDFImages(imageBuffer);
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: ANALYZE_RESUME_PROMPT,
          },
          {
            role: 'user',
            content: formattedReq,
          },
        ],
      });
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
  formatPDFImages(imageBuffer: Buffer[]): Array<ChatCompletionContentPartText> {
    const formattedReq = [];
    for (const buffer of imageBuffer) {
      formattedReq.push({
        type: 'image_url',
        image_url: {
          url: `data:image/png;base64,${buffer.toString('base64')}`,
        },
      });
    }
    return formattedReq;
  }

  async compareResumeWithJobDescription(
    resume: Buffer[],
    jobDescription: string,
  ) {
    try {
      const formattedReq = this.formatPDFImages(resume);

      formattedReq.push({
        type: 'text',
        text: `job description: ${jobDescription}`,
      });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: COMPARE_RESUME_WITH_JOB_DESCRIPTION_PROMPT,
          },
          {
            role: 'user',
            content: formattedReq,
          },
        ],
      });
      return {
        result: JSON.parse(response.choices[0].message.content || '{}'),
        jobDescription,
      };
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  async generateCoverLetter(resumeData: Buffer[], jobDescription: string) {
    try {
      const formattedReq = this.formatPDFImages(resumeData);

      formattedReq.push({
        type: 'text',
        text: GENERATE_COVER_LETTER_USER_PROMPT,
      });

      formattedReq.push({
        type: 'text',
        text: `###{${jobDescription}}###`,
      });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: GENERATE_COVER_LETTER_PROMPT,
          },
          {
            role: 'user',
            content: formattedReq,
          },
        ],
        stream: true,
      });
      return response;
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}
