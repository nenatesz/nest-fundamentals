// using the dto, we make sure that the request payload has everything we require before running further code.
import { IsString } from "class-validator";
import { Flavor } from "../entities/flavor.entity";
export class CreateCoffeeDto {
   @IsString()
   readonly name: string;
   @IsString()
   readonly brand: string;
   @IsString({each: true})
   readonly flavors: string[];
}


