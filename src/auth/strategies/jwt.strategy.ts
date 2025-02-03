import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@server/user/services/user.service';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '@lib/shared/interfaces/auth.interface';
import { User } from '@lib/shared/database';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const user = await this.userService.findOne(
      { where: { id: payload.sub } },
      false,
    );

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
