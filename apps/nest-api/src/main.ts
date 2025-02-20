import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { CustomLogger } from '@lib/shared/utils';

import { formatErrorData } from '@lib/shared/utils';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Optional: allows implicit conversions
      },
      whitelist: true,
      exceptionFactory: (errors) => {
        const result = formatErrorData(errors);
        return new BadRequestException(result);
      },
    }),
  );

  const ENV = configService.get('ENV');

  if (ENV === 'production') {
    app.use(helmet());
  }

  const PORT = configService.get('PORT');
  app.enableCors({ origin: '*' });
  await app.listen(PORT ?? 3000);
  Logger.verbose(`Server is running on port ${PORT}`, 'Bootstarp');
}
bootstrap();
