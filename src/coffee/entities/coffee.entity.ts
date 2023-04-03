import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";
// An entity represents a relationship between a typescript class and an sql db table
// Each entity class represents an sql table.
@Schema()
export class Coffee extends Document {
    @Prop()
    name: string;

    @Prop()
    brand: string;

    @Prop({default: 0})
    recommendations: number;

    // @JoinTable()
    // @ManyToMany(
    //     type => Flavor, 
    //     flavor => flavor.coffees,
    //     {cascade: true}
    //     )

    @Prop([String])
    flavors:string[];
}

export const CoffeeSchema = SchemaFactory.createForClass(Coffee)