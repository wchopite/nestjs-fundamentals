import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Patch,
  Delete,
  // HttpCode,
  // HttpStatus
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto, UpdateCoffeeDto } from './dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}

  @Get()
  findAll(@Query() pagination: any) {
    const { limit, offset } = pagination;
    return this.coffeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    // this is = number because ValidationPipe.transform prop in main
    console.log(typeof id);
    return this.coffeeService.findOne('' + id);
  }

  @Post()
  // @HttpCode(HttpStatus.GONE)
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    // this is = true because ValidationPipe.transform prop in main
    console.log(createCoffeeDto instanceof CreateCoffeeDto);
    return this.coffeeService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeeService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeeService.remove(id);
  }
}
