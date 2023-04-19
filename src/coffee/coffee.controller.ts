import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { Protocol } from '../common/decorators/protocol.decorator';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.interface';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from 'src/users/enums/roles.enums';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enums';

// @UsePipes(ValidationPipe )
// @Roles(Role.Regular)
@Auth(AuthType.Bearer, AuthType.ApiKey)
@Controller('coffee')
export class CoffeeController {
    constructor(private readonly coffeeService: CoffeeService) {}

    @Get()
    findAll(@ActiveUser('email') user: ActiveUserData, @Protocol() protocol: string, @Query() paginationQuery: PaginationQueryDto) {
        console.log('user', user)
       // const {limit, offset} = paginationQuery;
        return this.coffeeService.findAll(paginationQuery)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
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
