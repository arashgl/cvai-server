import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from './base/base.entity';
import { RoleEnum } from '../enums/RoleEnum';
import { Exclude } from 'class-transformer';
import { Resume } from './resume.entity';

@Entity()
export class User extends AppBaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    default: RoleEnum.USER,
    type: 'enum',
    enum: RoleEnum,
  })
  role: RoleEnum;

  @OneToMany(() => Resume, (resume) => resume.user)
  resumes: Resume[];
}
