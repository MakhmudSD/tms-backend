import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { SeedService } from '../../database/seeds/seed.service';

// Import entities
import { User } from '../users/user.entity';
import { Role } from '../users/role.entity';
import { Driver } from '../drivers/driver.entity';
import { Order } from '../orders/order.entity';
import { Branch } from '../korean-tms/branch.entity';
import { Client } from '../korean-tms/client.entity';
import { Asset } from '../korean-tms/asset.entity';
import { Waypoint } from '../korean-tms/waypoint.entity';
import { Settlement } from '../korean-tms/settlement.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Role, Driver, Order, Branch, Client, Asset, Waypoint, Settlement],
        synchronize: false, // Never modify existing schema
        logging: false, // Disable query logging for production
        retryAttempts: 3,
        retryDelay: 3000,
        autoLoadEntities: true,
        keepConnectionAlive: true, // Keep connection alive
      }),
    }),
    // Register entities for repository injection
    TypeOrmModule.forFeature([User, Role, Driver, Order, Branch, Client, Asset, Waypoint, Settlement]),
  ],
  providers: [DatabaseService, SeedService],
  controllers: [DatabaseController],
  exports: [DatabaseService, SeedService, TypeOrmModule],
})
export class DatabaseModule {}
