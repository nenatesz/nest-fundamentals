import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

// Providers can inject dependencies
@Injectable()
export class CoffeeService {
    private coffees: Coffee[] = [
        {
            id: 1,
            name: 'Shipreck Roast',
            brand: 'Buddy Brew',
            flavours: ['chocolate', 'vanilla']
        },
    ]

    findAll () {
        return this.coffees;
    }

    findOne (id: string) {
       const coffee = this.coffees.find(coffee => coffee.id === +id);
       if (!coffee){
        //throw new HttpException(`coffee #${id} not found`, HttpStatus.NOT_FOUND)
        throw new NotFoundException(`coffee #${id} not found`)
       }
       return coffee;
    }

    create (createCoffeeDto: any) {
        return this.coffees.push(createCoffeeDto);
    }

    update (id: string, updateCoffeeDto: any) {
        const existingCoffee = this.findOne(id);
        if (existingCoffee) {
            // Update existing coffee
        }
    }

    remove (id: string) {
        const coffeeIndex = this.coffees.findIndex(coffee => coffee.id === +id);
        if (coffeeIndex >= 0) {
            return this.coffees.splice(coffeeIndex, 1)
        }
    }
}
