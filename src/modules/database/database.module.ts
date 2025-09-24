import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';

// Import entities
import { User } from '../users/user.entity';
import { Role } from '../users/role.entity';
import { Driver } from '../drivers/driver.entity';
import { Order } from '../orders/order.entity';

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
        username: configService.get<string>('DB_USERNAME',),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Role, Driver, Order],
        synchronize: false, // Never modify existing schema
        logging: false, // Disable query logging for production
        retryAttempts: 3,
        retryDelay: 3000,
        autoLoadEntities: true,
        keepConnectionAlive: true, // Keep connection alive
      }),
    }),
    // Register entities for repository injection
    TypeOrmModule.forFeature([User, Role, Driver, Order]),
  ],
  providers: [DatabaseService],
  controllers: [DatabaseController],
  exports: [DatabaseService, TypeOrmModule],
})
export class DatabaseModule {}
