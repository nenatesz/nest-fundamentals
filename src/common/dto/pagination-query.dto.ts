import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    //@Type(() => Number) // used the enableImplicitConversion option in the main.ts file instead
    @IsPositive()
    limit: number;

    @IsOptional()
    @IsPositive()
   // @Type(() => Number) // used the enableImplicitConversion option in the main.ts file instead
    offset: number
}
