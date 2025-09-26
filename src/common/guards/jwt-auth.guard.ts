import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '../../modules/users/user.entity';
import { Role } from '../../modules/users/role.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      // Get user with role information from database
      const user = await this.usersRepository.findOne({
        where: { user_id: payload.sub, status_code: 'ACTIVE' },
        relations: ['role'],
      });

      if (!user) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Attach user with role information to request
      request['user'] = {
        ...payload,
        role_name: user.role?.role_name,
        role_id: user.role_id,
        user_id: user.user_id,
        login_id: user.login_id,
        user_name: user.user_name,
        email: user.email,
      };
      
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return undefined;
    }
    
    const [type, token] = authHeader.split(' ');
    
    return type === 'Bearer' ? token : undefined;
  }
}
