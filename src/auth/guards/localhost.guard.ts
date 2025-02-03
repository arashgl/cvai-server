import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ALLOW_LOCALHOST_ONLY_KEY } from '../decorators/local-only.decorator';

@Injectable()
export class LocalhostGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isRestrictedToLocalhost = this.reflector.get<boolean>(
      ALLOW_LOCALHOST_ONLY_KEY,
      context.getHandler(),
    );
    if (!isRestrictedToLocalhost) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const clientIp = request.ip;

    return clientIp.includes('127.0.0.1') || clientIp === '::1';
  }
}
