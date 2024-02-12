import { Injectable, Module } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import {
  COFFEE_BRANDS,
  COFFEE_COUNTRIES,
  ASYNC_COFFEE_COUNTRIES,
} from './coffee.contants';

// custom provider -> value passed provide
// useful to inject a constant value (external lib, or mock object)
// class MockCoffeeService {}

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeCountriesFactory {
  create() {
    return ['Argentina', 'Colombia'];
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeeController],
  providers: [
    // useClass provider: default
    // {
    //   provide: CoffeeService,
    //   useClass: CoffeeService,
    // },
    CoffeeService,
    CoffeeCountriesFactory, // we need to register it as a provider (factory class)
    // explicit class provider dependencies
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
    // non class based provider tokens, with useValue
    {
      provide: COFFEE_BRANDS,
      useValue: ['nescafe', 'cabrales'],
    },
    // providers factory pattern
    {
      provide: COFFEE_COUNTRIES,
      useFactory: (countriesFactory: CoffeeCountriesFactory) =>
        countriesFactory.create(),
      inject: [CoffeeCountriesFactory],
    },
    // async providers pattern
    {
      provide: ASYNC_COFFEE_COUNTRIES,
      useFactory: async (
        countriesFactory: CoffeeCountriesFactory,
      ): Promise<string[]> => {
        const countries = await Promise.resolve(countriesFactory.create());
        return countries;
      },
      inject: [CoffeeCountriesFactory],
    },
  ],
  exports: [CoffeeService],
})
export class CoffeeModule {}
