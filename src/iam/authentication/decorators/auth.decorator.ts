import { SetMetadata } from "@nestjs/common";
import { AuthType } from "../enums/auth-type.enums";

export const AUTH_TYPE_KEY = 'authType';

export const Auth =  (...authTypes: AuthType[]) => {
    console.log('authTypes', authTypes)
    return SetMetadata(AUTH_TYPE_KEY, authTypes);
}