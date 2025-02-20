import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import FormData from 'form-data';

@Injectable()
export class UtilsService {
  constructor(private readonly httpService: HttpService) {}

  async convertPDFtoText(file: Express.Multer.File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = await this.httpService.axiosRef.post(
        '/extract-text',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );

      return response.data.text;
    } catch (error) {
      console.error('Error converting PDF to text:', error);
      throw error;
    }
  }
}
