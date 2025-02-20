import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';

export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user) return request.user;
    else if (request.headers['authorization']) {
      return jwtDecode(request.headers['authorization']?.split(' ')?.[1]);
    }
  },
);
