import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { authenticator } from 'otplib';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class OtpAuthenticationService {
    constructor (
        private readonly configService: ConfigService, 
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>
    ) {}

    async generateSecret (email: string) {
        const secret = authenticator.generateSecret();
        const appName = this.configService.getOrThrow('tfaAppName');
        const uri = authenticator.keyuri(email, appName, secret)

        return {
            uri,
            secret
        }
    }

     verifyCode (code: string, secret: string) {
        return authenticator.verify({
            token: code,
            secret
        });
    }

    async enableTfaForUser (email: string, secret: string) {
        const { id } = await this.userRepository.findOneOrFail({
            where: {email: email},
            select: {id: true}
        })

        await this.userRepository.update({id: id}, {tfaSecret: secret, isTfaEnabled: true});

    }

}
