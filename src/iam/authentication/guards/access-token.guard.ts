import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { REQUEST_USER_KEY } from '../../iam.constants';
import jwtConfig from '../../config/jwt.config';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.log('here')
      throw new UnauthorizedException()
    }
    try{
    
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
      request[REQUEST_USER_KEY] = payload;
    }catch(error){
      console.log('hereee')
      throw new UnauthorizedException(error)
    }
   
    return true;
  }

  private extractTokenFromHeader (request: Request) : string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}


