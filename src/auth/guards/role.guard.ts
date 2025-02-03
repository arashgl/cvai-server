import { User } from '@lib/shared/database';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@server/auth/decorators/role.decorator';
import { isPublic } from '@server/auth/utils/auth-utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const requiredRoles: string[] = this.reflector.getAllAndOverride(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || isPublic(context, this.reflector)) {
      return true;
    }
    const user: User = request.user;
    return requiredRoles.some((role) => role === user.role);
  }
}
