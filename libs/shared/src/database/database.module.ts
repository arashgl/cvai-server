import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmRepositories } from '@lib/shared/database/typeorm-repositories';
import { TypeOrmOptions } from '@lib/shared/services/typeorm-config.service';
import { SharedModule } from '@lib/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useClass: TypeOrmOptions,
    }),
    TypeOrmModule.forFeature(TypeOrmRepositories),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
