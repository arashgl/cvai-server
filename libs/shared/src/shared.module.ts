import { Module } from '@nestjs/common';
import { TypeOrmOptionsService } from '@lib/shared/database';

@Module({
  imports: [],
  controllers: [],
  providers: [TypeOrmOptionsService],
  exports: [TypeOrmOptionsService],
})
export class SharedModule {}
