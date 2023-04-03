import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';
import { DataSource, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './constants';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

// Providers can inject dependencies
@Injectable()
export class CoffeeService {
    constructor(
        @InjectModel(Coffee.name)
        private readonly coffeeModel: Model<Coffee>,
        @InjectConnection()
        private readonly connection: Connection,
        @InjectModel(Event.name)
        private readonly eventModel: Model<Event>,
        @Inject(COFFEE_BRANDS) coffeBrands: string[] ,
        private readonly configService: ConfigService
        ){
            const databaseHost = this.configService.get<string>('database.host')
            console.log(databaseHost)
        }

    findAll (paginationQuery: PaginationQueryDto) {
        const {limit, offset} = paginationQuery;
        // return this.coffeeRepository.find({
        //     relations: ['flavors'],
        //     skip: offset,
        //     take: limit
        // });
        return this.coffeeModel.find().skip(offset).limit(limit).exec();
    }

    async findOne (id: string) {
    //    const coffee = await this.coffeeRepository.findOne(
    //     {where: {id: +id}, relations: ['flavors']},
    //     );
        const coffee = await this.coffeeModel.findById(id).exec()
       if (!coffee){
        //throw new HttpException(`coffee #${id} not found`, HttpStatus.NOT_FOUND)
        throw new NotFoundException(`coffee #${id} not found`)
       }
       return coffee;
    }

    async create (createCoffeeDto: CreateCoffeeDto) {
        // loop through all the flavors in the createCoffeeDto 
        // const flavors = await Promise.all(
        //     createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        //     )
        const coffee = new this.coffeeModel(createCoffeeDto);
        return coffee.save()
    }

    async update (id: string, updateCoffeeDto: UpdateCoffeeDto) {
        // const flavors = updateCoffeeDto.flavors  && 
        // (await Promise.all(updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))));

        const coffee = await this.coffeeModel.findOneAndUpdate({_id: id}, {$set: updateCoffeeDto}, {new: true}).exec();
        if (!coffee) {
            // Update existing coffee
            throw new NotFoundException(`coffee #${id} not found`)
        }
        return coffee;
    }

    async remove (id: string) {
        const coffee = await this.coffeeModel.findByIdAndRemove(id)
        if (!coffee) {
            throw new NotFoundException(`coffee #${id} not found`)
        }
        return coffee;
    }

    async recommendCoffee (coffee: Coffee) {
        const session = await this.connection.startSession();
        session.startTransaction()

        try{
            coffee.recommendations++

            const recommendEvent = new this.eventModel({
                name: 'recommend_coffee',
                type: 'coffee',
                payload: {CoffeeId: coffee.id}

            });

            await recommendEvent.save({session});
            await coffee.save({session})

            await session.commitTransaction()

        }catch(error) {
            await session.abortTransaction()
        }finally{
            await session.endSession()
        }

    }

    // private async preloadFlavorByName (name: string): Promise<Flavor> {
    //     const existingFlavor = await this.flavorRepository.findOne({where: {name: name}});
    //     if(existingFlavor) return existingFlavor;
    //     return this.flavorRepository.create({name});

    // }
}
