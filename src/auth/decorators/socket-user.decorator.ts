import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { IJwtPayload } from '@lib/shared/interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const SocketUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IJwtPayload => {
    // console.log(ctx);
    const client: Socket = ctx.switchToWs().getClient<Socket>();
    const jwtService = new JwtService();
    const configService = new ConfigService();
    return jwtService.verify(
      client.handshake.auth?.authorization?.split(' ')[1],
      { secret: configService.getOrThrow('JWT_SECRET') },
    ) as IJwtPayload;
  },
);
