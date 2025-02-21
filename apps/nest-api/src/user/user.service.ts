import { User } from '@app/shared/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUser(user: User) {
    return this.userRepository.findOne({
      where: { id: user.id },
    });
  }
}
