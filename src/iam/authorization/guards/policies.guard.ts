import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { POLICY_KEY } from '../decorators/policies.decorator';
import { PolicyhandlerStorage } from '../policies/policy-handlers.storage';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor (private readonly reflector: Reflector, private readonly policyhandlerStorage: PolicyhandlerStorage) {

  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const policies = this.reflector.getAllAndOverride(POLICY_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (policies) {
      const user = context.switchToHttp().getRequest<Request>()[REQUEST_USER_KEY] as ActiveUserData;
      await Promise.all(policies.map(policy => {
        const policyHandler = this.policyhandlerStorage.get(policy.constructor as Type)
        return policyHandler.handle(policy, user)
      })).catch(err => {
        throw new ForbiddenException(err.messasge)
      });

    }
    return true;
  }
}
