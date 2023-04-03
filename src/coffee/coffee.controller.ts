import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { Protocol } from '../common/decorators/protocol.decorator';

// @UsePipes(ValidationPipe )
@Controller('coffee')
export class CoffeeController {
    constructor(private readonly coffeeService: CoffeeService) {}

    @Public()
    @Get()
    findAll(@Protocol() protocol: string, @Query() paginationQuery: PaginationQueryDto) {
        console.log('protocol', protocol)
       // const {limit, offset} = paginationQuery;
        return this.coffeeService.findAll(paginationQuery)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coffeeService.findOne(id)
    }

    @Post()
   // @HttpCode(HttpStatus.FORBIDDEN)
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
        console.log(createCoffeeDto instanceof CreateCoffeeDto)
        return this.coffeeService.create(createCoffeeDto)
    }

    @Patch(':id')
    update (@Param('id') id: string, @Body() body: UpdateCoffeeDto) {
        return this.coffeeService.update(id, body)
    }

    @Delete(':id')
    remove (@Param('id') id: string) {
        return this.coffeeService.remove(id)
    }
}
