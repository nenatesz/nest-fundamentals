import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiKey } from "../api-keys/entitties/api-key";
import { Role } from "../enums/roles.enums";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    password: string; 

    @Column({enum: Role, default: Role.Regular})
    role: Role;

    @Column({default: false})
    isTfaEnabled: boolean

    @Column({nullable: true})
    tfaSecret: string

    @JoinTable()
    @OneToMany((type) => ApiKey, (apiKey) => apiKey.user)
    apiKeys: ApiKey[]
}
