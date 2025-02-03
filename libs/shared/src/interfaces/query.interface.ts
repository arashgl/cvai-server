import { Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';
import {
  FindOperator,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';
import 'reflect-metadata';

export class QueryBuilderParams<T = any> {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Object || Array)
  filter?: FindOptionsWhere<T>[] | FindOptionsWhere<T>;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page?: number = 0;

  @IsOptional()
  @Type(() => Object)
  sort?: { field: string; type: 'ASC' | 'DESC' };

  @IsOptional()
  @Type(() => String)
  relation?: string;

  @IsOptional()
  @Type(() => String)
  select?: string;
}

export class QueryParams<T = any> {
  // @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 0;

  // @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsObject()
  @IsOptional()
  where?: FindOptionsWhere<T>;

  @IsObject()
  @IsOptional()
  relations?: FindOptionsRelations<T>;

  @IsString({ each: true })
  @IsOptional()
  select?: FindOptionsSelect<T>;

  @IsObject()
  @IsOptional()
  order?: FindOptionsOrder<T>;

  @IsString()
  @IsOptional()
  search?: FindOperator<string>;

  @IsOptional()
  @IsString()
  searchField?: string;
}
