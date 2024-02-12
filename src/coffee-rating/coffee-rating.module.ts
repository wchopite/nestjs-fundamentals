import { Module } from '@nestjs/common';
import { CoffeeRatingService } from './coffee-rating.service';
import { CoffeeModule } from '../coffee/coffee.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    // Here we are importing a dynamic module
    DatabaseModule.register({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
    }),
    CoffeeModule,
  ],
  providers: [CoffeeRatingService],
})
export class CoffeeRatingModule {}
