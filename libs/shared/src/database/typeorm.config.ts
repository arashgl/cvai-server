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
      host: this.configService.get('POSTGRES_HOST'),
      port: +this.configService.get('POSTGRES_PORT'),
      username: this.configService.get('POSTGRES_USER'),
      password: this.configService.get('POSTGRES_PASSWORD'),
      database: this.configService.get('POSTGRES_DB'),
      synchronize: true,
      entities: TypeOrmRepositories,
    };
  }
}
