import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User } from '../users/user.entity';
import { Role } from '../users/role.entity';
import { RoleService } from '../users/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecret', // Fallback secret
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard, RoleService],
  exports: [AuthService, JwtAuthGuard, RolesGuard, RoleService],
})
export class AuthModule {}
