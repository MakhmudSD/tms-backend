import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

// Feature modules
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { DriversModule } from "./modules/drivers/drivers.module";
import { OrdersModule } from "./modules/orders/orders.module";

// Entities
import { User } from "./modules/users/user.entity";
import { Role } from "./modules/users/role.entity";
import { Driver } from "./modules/drivers/driver.entity";
import { Order } from "./modules/orders/order.entity";

@Module({
  imports: [
    // Global config module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // PostgreSQL Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DB_HOST"),
        port: Number(configService.get("DB_PORT")),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: "postgres",
        entities: [User, Role, Driver, Order],
        synchronize: false, // Disable sync to prevent conflicts with existing data
        logging: false, // Reduce log noise
      }),
    }),

    // JWT module is configured in AuthModule

    // Feature modules
    AuthModule,
    UsersModule,
    DriversModule,
    OrdersModule,
  ],
})
export class AppModule {}
