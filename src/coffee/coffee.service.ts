import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeeDto, UpdateCoffeeDto } from './dto';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import {
  COFFEE_BRANDS,
  COFFEE_COUNTRIES,
  ASYNC_COFFEE_COUNTRIES,
} from './coffee.contants';
// import { ConfigService, ConfigType } from '@nestjs/config';
import { ConfigType } from '@nestjs/config';
import coffeeConfig from './config/coffee.config';

@Injectable({ scope: Scope.TRANSIENT })
export class CoffeeService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly datasource: DataSource,
    @Inject(COFFEE_BRANDS) private readonly coffeeBrands: string[],
    @Inject(COFFEE_COUNTRIES) private readonly coffeeCountries: string[],
    @Inject(ASYNC_COFFEE_COUNTRIES)
    private readonly asyncCoffeeCountries: string[],
    @Inject(coffeeConfig.KEY)
    private readonly coffeeConfiguration: ConfigType<typeof coffeeConfig>,
    // private readonly configService: ConfigService,
  ) {
    // console.log(`Coffee Brands constant: ${this.coffeeBrands}`);
    // console.log(`Coffee Countries constant: ${this.coffeeCountries}`);
    // console.log(`Async Coffee Countries: ${this.asyncCoffeeCountries}`);
    console.log('CoffeService instanciated');

    // const dbHost = this.configService.get('database.host');
    // console.log(`dbHost: ${dbHost}`);
    console.log(this.coffeeConfiguration.foo);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { offset, limit } = paginationQuery;
    return this.coffeeRepository.find({
      relations: {
        flavors: true,
      },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: {
        flavors: true,
      },
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDTO: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDTO.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDTO,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDTO: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDTO.flavors &&
      (await Promise.all(
        updateCoffeeDTO.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeDTO,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.datasource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await Promise.all([
        queryRunner.manager.save(coffee),
        queryRunner.manager.save(recommendEvent),
      ]);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const flavor = await this.flavorRepository.findOne({ where: { name } });
    if (flavor) {
      return flavor;
    }
    return this.flavorRepository.create({ name });
  }
}
