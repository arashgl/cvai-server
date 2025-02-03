import { AppBaseEntity } from '../database/entities/base/base.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindOneOptions,
  ILike,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryBuilderParams, QueryParams } from '@lib/shared/interfaces';
import { ParseBooleanValues } from '../utils/dto.utils';
import { PaginateData } from '@lib/shared/utils/paginate-data';

export abstract class CrudService<T extends AppBaseEntity> {
  private queryInitializer = {
    order: {},
    relations: {},
    select: {},
    where: {},
  };
  protected constructor(private repository: Repository<T>) {}

  create(body: DeepPartial<T>) {
    const entity = this.repository.create(body);
    return this.repository.save(entity);
  }

  async createUnique(body: DeepPartial<T>, uniqueFind: FindOneOptions<T>) {
    const uniqueEntity = await this.findOne(uniqueFind, false);
    if (uniqueEntity) throw new ConflictException();
    const entity = this.repository.create(body);
    return this.repository.save(entity);
  }

  async findOne(
    options: FindOneOptions<T>,
    exception = false,
    query: QueryParams<T> = this.queryInitializer,
  ) {
    const entity = await this.repository.findOne({
      ...options,
      select: query.select,
      relations: ParseBooleanValues(query.relations),
    });

    if (!entity && exception) throw new NotFoundException();

    return entity;
  }

  async findAllQueryBuilder<T>(
    query: QueryBuilderParams<T>,
    cb: SelectQueryBuilder<T>,
  ) {
    const { page, limit, sort } = query;

    const res = await cb
      .skip(query?.page ? this.getSkip(query.page, query.limit) : 0)
      .take(limit)
      .orderBy(sort?.field, sort?.type)
      .getMany();

    const count = await cb.getCount();
    return PaginateData(res, page, limit, count);
  }

  async findAll(query: QueryParams<T> = this.queryInitializer) {
    if (query.page && !query.limit) query.limit = 10;

    if (query.search && query.searchField) {
      for (const field of query.searchField.split(',')) {
        query.where = {
          ...query.where,
          [field]: ILike(`%${query.search}%`),
        };
      }
    }

    const [entities, count] = await this.repository.findAndCount({
      ...query,
      relations: ParseBooleanValues(query.relations),
      take: query?.limit || 0,
      skip: query?.page && this.getSkip(query.page, query.limit),
    });

    return PaginateData(entities, query?.page, query?.limit, count);
  }

  async update(id: number, body: DeepPartial<T>) {
    const entity = await this.findOne({ where: { id } } as any);
    const preload = await this.repository.preload({ ...entity, ...body });
    return this.repository.save(preload);
  }

  async remove(id: number) {
    const entity = await this.findOne({ where: { id } } as any, true);
    if (entity) {
      return this.repository.remove(entity);
    }
  }

  async softRemove(id: number) {
    const entity = await this.findOne({ where: { id } } as any);
    if (entity) {
      return this.repository.softRemove(entity);
    }
  }

  private getSkip(page = 0, limit: number) {
    return (page - 1) * limit;
  }
}
