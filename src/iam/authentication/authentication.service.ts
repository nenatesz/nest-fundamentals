import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { InvalidatedRefreshTokenError, RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { randomUUID } from 'crypto';
import { OtpAuthenticationService } from './otp-authentication.service';

@Injectable()
export class AuthenticationService {
    constructor(@InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly otpAuthService: OtpAuthenticationService

    ){
        console.log(jwtConfiguration)
    }

    async signUp(signUpDto: SignUpDto) {
        try {
            const user = new User();
            user.email = signUpDto.email;
            user.password = await this.hashingService.hash(signUpDto.password);

            await this.userRepository.save(user);

        }catch(err){
            const PgUniqueViolationErrorCode = '23505';
            if (err.code === PgUniqueViolationErrorCode){
                throw new ConflictException();
            } 
            throw err;
        }
    }

    async signIn(signInDto: SignInDto) {
        try{
            const user = await this.userRepository.findOne({where: {email: signInDto.email}});
            if (!user) throw new UnauthorizedException('User does not exist');
            const isEqual = await this.hashingService.compare(signInDto.password, user.password);
            if (!isEqual) throw new UnauthorizedException('Password does not match');
            console.log('user.isTfaEnabled', user.isTfaEnabled)
            if (user.isTfaEnabled) {
                const isValid =  this.otpAuthService.verifyCode(signInDto.tfaCode, user.tfaSecret);
                console.log('isValid', isValid)
                if(!isValid) throw new UnauthorizedException('Invalid 2FA Code')
            }


            return await this.generateTokens(user)

        }catch(error) {
            throw error;
        }
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto) {
        try{
            const {sub, refreshTokenId} =  await this.jwtService.verifyAsync<Pick<ActiveUserData, 'sub'> & {refreshTokenId: string}>(refreshTokenDto.refreshToken, {
                issuer: this.jwtConfiguration.issuer,
                audience: this.jwtConfiguration.audience,
                secret: this.jwtConfiguration.secret
            });
    
            const user = await this.userRepository.findOneByOrFail({id: sub});
            const isValid = await this.refreshTokenIdsStorage.validate(user.id, refreshTokenId);
            if (isValid) {
                await this.refreshTokenIdsStorage.inValidate(user.id)
            } else {
                throw new Error('Refresh Token is invalid')
            }
            return await this.generateTokens(user)

        }catch(error){
            if (error instanceof InvalidatedRefreshTokenError) {
                console.log('here')
                throw new UnauthorizedException('Access Denied')
            }
            throw new UnauthorizedException();
        }

    }

    private async signToken<T> (userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload,
            } ,
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn 
            }
        )
    }

    async generateTokens (user: User) {
        const refreshTokenId = randomUUID();
        const [accessToken, refreshToken] = 
        await Promise.all([
                this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTtl, {email: user.email, role: user.role}),
                this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {refreshTokenId})
            ]);

        await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
        return {
            accessToken,
            refreshToken
        }
    }
}
