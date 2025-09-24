import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate user credentials and return user data
   */
  async validateUser(login_id: string, password: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({
        where: { login_id, status_code: 'ACTIVE' }
      });

      if (!user) {
        return null;
      }

      // Check password (assuming it's hashed with bcrypt)
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return null;
      }

      // Return user data without password
      const { password_hash: _, ...result } = user;
      return result;
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  }

  /**
   * Login user and return JWT token
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      username: user.login_id, 
      sub: user.user_id, 
      role_id: user.role_id 
    };

    console.log('🔧 Creating JWT token for user:', user.login_id);
    const access_token = this.jwtService.sign(payload);
    console.log('✅ JWT token created successfully');

    return {
      access_token,
      user: {
        user_id: user.user_id,
        login_id: user.login_id,
        user_name: user.user_name,
        role_id: user.role_id,
        email: user.email,
        phone_number: user.phone_number,
        status_code: user.status_code,
      },
    };
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { user_id: userId, status_code: 'ACTIVE' } 
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password_hash, ...result } = user;
    return result as User;
  }
}
