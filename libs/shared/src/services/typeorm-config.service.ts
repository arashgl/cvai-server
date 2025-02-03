import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TypeOrmOptionsService } from '@lib/shared/database';

@Injectable()
export class TypeOrmOptions implements TypeOrmOptionsFactory {
  constructor(private configService: TypeOrmOptionsService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.configService.getTypeormOptions();
  }
}
