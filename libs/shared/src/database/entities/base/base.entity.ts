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
export abstract class AppBaseEntity extends BaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
