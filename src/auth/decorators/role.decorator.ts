import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '@lib/shared/database';
export const ROLES_KEY = 'roles';

export const Roles = (...roles: RoleEnum[]): MethodDecorator => {
  return SetMetadata(ROLES_KEY, roles);
};
