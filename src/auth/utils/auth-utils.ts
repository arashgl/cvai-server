import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@server/auth/decorators/public.decorator';

//checks if a route is decorated with @Public()
export function isPublic(context: ExecutionContext, reflector: Reflector) {
  return reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
}
