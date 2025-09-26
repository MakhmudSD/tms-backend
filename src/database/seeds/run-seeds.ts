import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { seedUsers } from './user.seed';
import { seedEmergencies } from './emergency.seed';

config();

import { User } from '../../modules/users/user.entity';
import { Role } from '../../modules/users/role.entity';
import { Driver } from '../../modules/drivers/driver.entity';
import { Order } from '../../modules/orders/order.entity';
import { Branch } from '../../modules/korean-tms/branch.entity';
import { Client } from '../../modules/korean-tms/client.entity';
import { Asset } from '../../modules/korean-tms/asset.entity';
import { Waypoint } from '../../modules/korean-tms/waypoint.entity';
import { Settlement } from '../../modules/korean-tms/settlement.entity';
import { Emergency } from '../../modules/korean-tms/emergency.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [User, Role, Driver, Order, Branch, Client, Asset, Waypoint, Settlement, Emergency],
  synchronize: false,
  logging: false,
});

async function runSeeds() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await dataSource.initialize();
    console.log('✅ Database connection established');

    await seedUsers(dataSource);
    await seedEmergencies(dataSource);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('✅ Database connection closed');
    }
  }
}

runSeeds();
