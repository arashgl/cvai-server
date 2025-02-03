import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { pdf } from 'pdf-to-img';

@Injectable()
export class UtilsService {
  async handleFile(file: Express.Multer.File) {
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const images = await pdf(file.buffer);
    for await (const image of images) {
      console.log(image, 'IMAGE<<');
    }
    const buffers = [];
    for await (const image of images) {
      buffers.push(image.buffer);
    }

    // Optimize image for OpenAI
    const opmtimizedBuffers = [];
    for (const buffer of buffers) {
      const optimizedBuffer = await sharp(buffer)
        .resize(1080, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toBuffer();
      opmtimizedBuffers.push(optimizedBuffer);
    }
    return opmtimizedBuffers;
  }
}
