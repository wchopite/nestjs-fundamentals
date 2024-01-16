import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Cabrales Colombia',
      brand: 'Cabrales',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    const coffee: Coffee = this.coffees.find((item) => item.id === +id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDTO: any) {
    return this.coffees.push(createCoffeeDTO);
  }

  update(id: string, updateCoffeeDTO: any) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      // update coffee
    }

    return existingCoffee;
  }

  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);
    let deletedCoffee: Coffee = null;
    if (coffeeIndex > 0) {
      deletedCoffee = this.coffees[coffeeIndex];
      this.coffees.splice(coffeeIndex, 1);
    }
    return deletedCoffee;
  }
}
