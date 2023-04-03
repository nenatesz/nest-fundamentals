import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { COFFEE_BRANDS } from './constants';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule], //this is an array of entities used in this module
    controllers: [CoffeeController],
    providers: [CoffeeService, {provide: COFFEE_BRANDS, useValue: ['brew buddy', 'nescafe']}],
    exports: [CoffeeService]
})
export class CoffeeModule {}
