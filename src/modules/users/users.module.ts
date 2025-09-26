import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), JwtModule.register({})],
  controllers: [UsersController],
  providers: [UsersService, RoleService],
  exports: [UsersService, RoleService],
})
export class UsersModule {}
