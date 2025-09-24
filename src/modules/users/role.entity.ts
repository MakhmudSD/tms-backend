import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

/**
 * Role Entity - Korean TMS Schema
 * Maps to the tms.roles table in the database
 */
@Entity({ name: 'roles', schema: 'tms' })
export class Role {
  @ApiProperty({ description: 'Role ID', example: 1 })
  @PrimaryGeneratedColumn({ name: 'role_id' })
  role_id: number;

  @ApiProperty({ description: 'Role name', example: 'admin' })
  @Column({ name: 'role_name', unique: true })
  role_name: string;

  @ApiProperty({ description: 'Role description', example: '시스템 관리자' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Relations
  @OneToMany(() => User, user => user.role)
  users: User[];
}
