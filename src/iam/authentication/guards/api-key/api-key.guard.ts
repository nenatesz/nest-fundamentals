import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { ApiKey } from '../../../../users/api-keys/entitties/api-key'
import { Repository } from 'typeorm';
import { ApiKeysService } from '../../api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeysService, 
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>
    ){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractKeyFromHeader(request);

    if (!apiKey) throw new UnauthorizedException();
    const ApiKeyEntityId = this.apiKeyService.extractIdFromApiKey(apiKey); 

    try {
      const apiKeyEntity = await this.apiKeyRepository.findOne({where: {uuid: ApiKeyEntityId}, relations: {user: true}});
      await this.apiKeyService.validate(apiKey, apiKeyEntity.key);
      request[REQUEST_USER_KEY] = {
        sub: apiKeyEntity.user.id,
        email: apiKeyEntity.user.email,
        role: apiKeyEntity.user.role,
      } as ActiveUserData

    }catch(error){
      throw new UnauthorizedException()
    }
    return true;
  }

  private extractKeyFromHeader(request: Request): string | undefined{
    const [type, apiKey] = request.headers.authorization.split(' ') ?? []
    return type === 'ApiKey' ? apiKey : undefined
  }
}
