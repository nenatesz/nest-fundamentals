import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthType } from './enums/auth-type.enums';
import { OtpAuthenticationService } from './otp-authentication.service';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly otpAuthService: OtpAuthenticationService
    ){}

    @Post('sign-up')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authenticationService.signUp(signUpDto);
    }

    @HttpCode(HttpStatus.OK) //use status code 200 instead on the default 201 for post routes in nestjs 
    @Post('sign-in')
    signIn(@Res({passthrough: true}) response: Response, @Body() signInDto: SignUpDto) {
        return this.authenticationService.signIn(signInDto);
        // const accessToken = await this.authenticationService.signIn(signInDto);
        // response.cookie('accessToken', accessToken, {
        //     secure: true,
        //     httpOnly: true,
        //     sameSite: true,
        // })
    }
    @HttpCode(HttpStatus.OK) //use status code 200 instead on the default 201 for post routes in nestjs 
    @Post('refresh-token')
    refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authenticationService.refreshToken(refreshTokenDto);

    }

    @Auth(AuthType.Bearer)
    @HttpCode(HttpStatus.OK) //use status code 200 instead on the default 201 for post routes in nestjs 
    @Post('2fa/generate')
    async generateQrCode (@ActiveUser() activeUser: ActiveUserData, @Res() response: Response) {
        const {uri, secret} = await this.otpAuthService.generateSecret(activeUser.email);
        console.log('uri', uri)
        await this.otpAuthService.enableTfaForUser(activeUser.email, secret);
        response.type('png'); 
        return toFileStream(response, uri)
    }
}
