import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.getOrThrow('PYTHON_OCR_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
