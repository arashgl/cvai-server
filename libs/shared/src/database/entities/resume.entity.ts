import { Column, ManyToOne, JoinColumn, Entity } from 'typeorm';
import { AppBaseEntity } from './base/base.entity';
import { User } from './user.entity';

@Entity()
export class Resume extends AppBaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb' })
  result: Record<string, string | number>;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.resumes)
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_resume_user' })
  user: User;
}
