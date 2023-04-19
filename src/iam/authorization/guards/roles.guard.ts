import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from 'src/users/enums/roles.enums';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!contextRoles) return true;

    const user = context.switchToHttp().getRequest<Request>()[REQUEST_USER_KEY] as ActiveUserData;

    return contextRoles.some(role => user.role === role);
  }
}
