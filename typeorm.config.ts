import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

// Import entities
import { User } from './src/modules/users/user.entity';
import { Role } from './src/modules/users/role.entity';
import { Driver } from './src/modules/drivers/driver.entity';
import { Order } from './src/modules/orders/order.entity';
import { Branch } from './src/modules/korean-tms/branch.entity';
import { Client } from './src/modules/korean-tms/client.entity';
import { Asset } from './src/modules/korean-tms/asset.entity';
import { Waypoint } from './src/modules/korean-tms/waypoint.entity';
import { Settlement } from './src/modules/korean-tms/settlement.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [User, Role, Driver, Order, Branch, Client, Asset, Waypoint, Settlement],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
