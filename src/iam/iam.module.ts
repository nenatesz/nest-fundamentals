import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { RolesGuard } from './authorization/guards/roles.guard';
import { PolicyhandlerStorage } from './authorization/policies/policy-handlers.storage';
import { FrameworkContributorPolicyHandler } from './authorization/policies/framework-contributor.policy';
import { PoliciesGuard } from './authorization/guards/policies.guard';
import { ApiKeysService } from './authentication/api-keys.service';
import { ApiKey } from '../users/api-keys/entitties/api-key';
import { ApiKeyGuard } from './authentication/guards/api-key/api-key.guard';
import { OtpAuthenticationService } from './authentication/otp-authentication.service';
import { SessionAuthenticationService } from './authentication/session-authentication.service';
import { SessionAuthenticationController } from './authentication/session-authentication.controller';
import * as session from 'express-session';
import * as passport from 'passport'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ApiKey]), 
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig)
],
  providers: [
    AuthenticationService,
    {
      provide: HashingService, 
      useClass: BcryptService
    },
    {
      provide: APP_GUARD, 
      useClass: AuthenticationGuard
    },
    {
      provide: APP_GUARD, 
      useClass: PoliciesGuard
    },
    RefreshTokenIdsStorage,
    AccessTokenGuard,
    ApiKeyGuard,
    PolicyhandlerStorage,
    FrameworkContributorPolicyHandler,
    ApiKeysService,
    OtpAuthenticationService,
    SessionAuthenticationService
  ],
    controllers: [AuthenticationController, SessionAuthenticationController]
})
export class IamModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: true,
        httpOnly: true
      }
    }),
    passport.initialize(),
    passport.session()
    ).forRoutes('*');
  }
}
