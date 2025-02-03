import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IBaseEntity } from './base-entity.interface';

@Entity()
export abstract class BaseBigEntity extends BaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
