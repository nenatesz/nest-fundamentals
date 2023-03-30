import { PartialType } from "@nestjs/mapped-types";
import { CreateCoffeeDto } from "./create-coffee.dto";

// use the @nest/mapped-types PartialType function to coppy the passed in class, but make its properties optional.
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {};
// export class UpdateCoffeeDto {
//     readonly name?: string;
//    readonly brand?: string;
//    readonly flavours: string[];
// }