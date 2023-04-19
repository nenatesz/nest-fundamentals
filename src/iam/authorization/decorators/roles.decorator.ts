import { SetMetadata } from "@nestjs/common";
import { Role } from "src/users/enums/roles.enums";

export const ROLES_KEY = 'roles' 
export const Roles = (...roles: Role[]) => {
    return SetMetadata(ROLES_KEY, roles);
}