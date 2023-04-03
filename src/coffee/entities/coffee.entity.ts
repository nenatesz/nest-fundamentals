import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";
// An entity represents a relationship between a typescript class and an sql db table
// Each entity class represents an sql table.
@Entity()
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    brand: string;

    @Column({default: 0})
    recommendations: number

    @JoinTable()
    @ManyToMany(
        type => Flavor, 
        flavor => flavor.coffees,
        {cascade: true}
        )
    flavors: Flavor[];
}