import { DataSource } from 'typeorm';
import { Coffee } from 'src/coffee/entities/coffee.entity';
import { Flavor } from 'src/coffee/entities/flavor.entity';
import { AddDescriptionToCoffee1706184512117 } from 'src/migrations/1706184512117-AddDescriptionToCoffee';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  entities: [Coffee, Flavor],
  migrations: [AddDescriptionToCoffee1706184512117],
});
