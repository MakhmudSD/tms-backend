import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.entity';

/**
 * User Entity - Korean TMS Schema
 * Maps to the tms.users table in the database
 */
@Entity({ name: 'users', schema: 'tms' })
export class User {
  @ApiProperty({ description: 'User ID', example: 1 })
  @PrimaryGeneratedColumn({ name: 'user_id' })
  user_id: number;

  @ApiProperty({ description: 'Login ID', example: 'admin' })
  @Column({ name: 'login_id', unique: true })
  login_id: string;

  @ApiProperty({ description: 'Hashed password' })
  @Column({ name: 'password_hash' })
  password_hash: string;

  @ApiProperty({ description: 'User name', example: '시스템 관리자' })
  @Column({ name: 'user_name' })
  user_name: string;

  @ApiProperty({ description: 'User email', example: 'admin@tms.com' })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({ description: 'Phone number', example: '010-1234-5678' })
  @Column({ name: 'phone_number', nullable: true })
  phone_number: string;

  @ApiProperty({ description: 'Branch ID', example: 1 })
  @Column({ name: 'branch_id', nullable: true })
  branch_id: number;

  @ApiProperty({ description: 'Role ID', example: 1 })
  @Column({ name: 'role_id', nullable: true })
  role_id: number;

  @ApiProperty({ description: 'Status code', example: 'ACTIVE' })
  @Column({ name: 'status_code', default: 'ACTIVE' })
  status_code: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => Role, role => role.users, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
