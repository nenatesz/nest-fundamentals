import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

// the reflector class allows us to retrieve metadata within a specific context.

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService, private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;
    
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization');
    console.log('key', this.configService.get('apiKey'))
    console.log('key', authHeader)
    return authHeader === this.configService.get('apiKey')
    // return authHeader === process.env.API_KEY
  }
}
