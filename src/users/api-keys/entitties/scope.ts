import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Scope {
@PrimaryGeneratedColumn()
id: number;

}