import { ConfigService, registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmRepositories } from './typeorm-repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmOptionsService {
  constructor(private readonly configService: ConfigService) {
    registerAs<TypeOrmModuleOptions>('typeorm-options', () =>
      this.getTypeormOptions(),
    );
  }
  getTypeormOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DATABASE_HOST'),
      port: +this.configService.get('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: this.configService.get('DATABASE_NAME'),
      entities: TypeOrmRepositories,
      synchronize: true,
    };
  }
}
