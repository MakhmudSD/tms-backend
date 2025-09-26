import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RoleService } from '../users/role.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private roleService: RoleService,
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

    const access_token = this.jwtService.sign(payload);

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
   * Register a new user
   * First user becomes admin, subsequent users can be created by admins
   */
  async signup(signupDto: SignupDto): Promise<any> {
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { login_id: signupDto.username }
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Initialize default roles if they don't exist
    await this.roleService.initializeDefaultRoles();

    // Check if any admin user already exists
    const hasAdmin = await this.roleService.hasAdminRole();
    const adminRole = await this.roleService.getAdminRole();
    
    // Check if there are any users with admin role
    const existingAdmin = await this.usersRepository.findOne({
      where: { role_id: adminRole.role_id }
    });

    // If no admin exists, first user becomes admin
    const isFirstUser = !hasAdmin || !existingAdmin;
    const userRole = isFirstUser ? adminRole : await this.roleService.findByName('dispatcher');

    // Hash password
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    // Create user
    const newUser = this.usersRepository.create({
      login_id: signupDto.username,
      password_hash: hashedPassword,
      user_name: signupDto.name || signupDto.username,
      email: signupDto.email || `${signupDto.username}@example.com`,
      phone_number: signupDto.phone || '010-0000-0000',
      role_id: userRole.role_id,
      status_code: 'ACTIVE',
    });

    const savedUser = await this.usersRepository.save(newUser);

    // Return user data without password
    const { password_hash: _, ...result } = savedUser;
    return {
      message: isFirstUser 
        ? 'Admin account created successfully! You are now the system administrator.'
        : 'User account created successfully!',
      user: {
        ...result,
        role_name: userRole.role_name,
      },
      isAdmin: isFirstUser
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
