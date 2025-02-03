import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from './base/base.entity';
import { RoleEnum } from '../enums/RoleEnum';

@Entity()
export class User extends AppBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: RoleEnum.USER })
  role: RoleEnum;
}
