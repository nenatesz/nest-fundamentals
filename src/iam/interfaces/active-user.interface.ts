import { Role } from "src/users/enums/roles.enums";

export interface ActiveUserData {
    sub: number;
    email: string;
    // refreshTokenId?: string
    role: Role;
}

export interface GeneratedApiKeyPayload {
    apiKey: string;
    hashedKey: string;
}