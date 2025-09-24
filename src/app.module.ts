import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

// Feature modules
import { DatabaseModule } from "./modules/database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { DriversModule } from "./modules/drivers/drivers.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { KoreanTmsModule } from "./modules/korean-tms/korean-tms.module";

@Module({
  imports: [
    // Global config module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Database connection is handled by DatabaseModule

    // JWT module is configured in AuthModule

    // Feature modules
    DatabaseModule,
    AuthModule,
    UsersModule,
    DriversModule,
    OrdersModule,
    KoreanTmsModule,
  ],
})
export class AppModule {}
