import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if login_id already exists
      const existingUser = await this.usersRepository.findOne({
        where: { login_id: createUserDto.username }
      });

      if (existingUser) {
        throw new ConflictException('Login ID already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = this.usersRepository.create({
        login_id: createUserDto.username,
        password_hash: hashedPassword,
        user_name: createUserDto.fullName || createUserDto.username,
        email: createUserDto.email,
        status_code: 'ACTIVE',
      });

      const savedUser = await this.usersRepository.save(user);

      // Return user without password
      const { password_hash, ...result } = savedUser;
      return result as User;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Get all users
   */
  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find({
      select: ['user_id', 'login_id', 'user_name', 'role_id', 'email', 'phone_number', 'status_code', 'created_at', 'updated_at'],
    });
    return users;
  }

  /**
   * Get user by ID
   */
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { user_id: id },
      select: ['user_id', 'login_id', 'user_name', 'role_id', 'email', 'phone_number', 'status_code', 'created_at', 'updated_at'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Update user
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check if login_id is being changed and if it already exists
    if (updateUserDto.username && updateUserDto.username !== user.login_id) {
      const existingUser = await this.usersRepository.findOne({
        where: { login_id: updateUserDto.username }
      });

      if (existingUser) {
        throw new ConflictException('Login ID already exists');
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (updateUserDto.username) updateData.login_id = updateUserDto.username;
    if (updateUserDto.fullName) updateData.user_name = updateUserDto.fullName;
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    
    // Hash password if provided
    if (updateUserDto.password) {
      updateData.password_hash = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.update({ user_id: id }, updateData);
    return this.findOne(id);
  }

  /**
   * Delete user (soft delete by setting status_code to INACTIVE)
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.update({ user_id: id }, { status_code: 'INACTIVE' });
  }

  /**
   * Permanently delete user
   */
  async permanentDelete(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
