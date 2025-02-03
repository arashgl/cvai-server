import { IJwtPayload } from '@lib/shared/interfaces/auth.interface';
import { CanActivate, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserService } from '@server/user/services/user.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers?.authorization?.split(' ')[1] ||
      context.args[0].handshake.auth?.token?.split(' ')[1];
    try {
      const decoded = this.jwtService.verify<IJwtPayload>(bearerToken, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });

      return new Promise(async (resolve, reject) => {
        const user = await this.userService.findOne({
          where: { id: decoded.sub },
        });

        if (user) resolve(user);
        else reject(false);
      });
    } catch (ex) {
      return false;
    }
  }
}
