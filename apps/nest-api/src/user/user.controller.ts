import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from '@app/shared';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getUser(@GetUser() user: User) {
    return this.userService.getUser(user);
  }
}
