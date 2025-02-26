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

  async analyzeImage(resumeText: string) {
    try {
      const formattedReq = [
        {
          type: 'text',
          text: `resume: ###{${resumeText}}###`,
        },
      ];
      const response = await this.openai.chat.completions.create({
        // model: 'gemini-2.0-pro-exp-02-05',
        model: 'google/gemini-2.0-flash-001',
        response_format: { type: 'json_object' },
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: ANALYZE_RESUME_PROMPT,
          },
          {
            role: 'user',
            content: formattedReq as ChatCompletionContentPartText[],
          },
        ],
      });
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  // formatPDFImages(imageBuffer: Buffer[]): Array<ChatCompletionContentPartText> {
  //   const formattedReq = [];
  //   for (const buffer of imageBuffer) {
  //     formattedReq.push({
  //       type: 'image_url',
  //       image_url: {
  //         url: `data:image/png;base64,${buffer.toString('base64')}`,
  //       },
  //     });
  //   }
  //   return formattedReq;
  // }

  async compareResumeWithJobDescription(
    resumeText: string,
    jobDescription: string,
  ) {
    try {
      const formattedReq = [
        {
          type: 'text',
          text: `resume: %%%{${resumeText}}%%%`,
        },
        {
          type: 'text',
          text: `job description: ###{${jobDescription}}###`,
        },
      ];

      const response = await this.openai.chat.completions.create({
        // model: 'gemini-2.0-pro-exp-02-05',
        model: 'google/gemini-2.0-flash-001',
        response_format: { type: 'json_object' },
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: COMPARE_RESUME_WITH_JOB_DESCRIPTION_PROMPT,
          },
          {
            role: 'user',
            content: formattedReq as ChatCompletionContentPartText[],
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

  async generateCoverLetter(resumeText: string, jobDescription: string) {
    try {
      const formattedReq = [
        {
          type: 'text',
          text: GENERATE_COVER_LETTER_USER_PROMPT,
        },
        {
          type: 'text',
          text: `resume: %%%{${resumeText}}%%%`,
        },
        {
          type: 'text',
          text: `job description: ###{${jobDescription}}###`,
        },
      ];

      const response = await this.openai.chat.completions.create({
        // model: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
        model: 'anthropic/claude-3.7-sonnet',
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: GENERATE_COVER_LETTER_PROMPT,
          },
          {
            role: 'user',
            content: formattedReq as ChatCompletionContentPartText[],
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
