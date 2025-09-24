import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

/**
 * Role Entity
 * Maps to the existing roles table in the database
 */
@Entity({ name: 'roles', schema: 'tms' })
export class Role {
  @ApiProperty({ description: 'Role ID', example: 1 })
  @PrimaryGeneratedColumn()
  role_id: number;

  @ApiProperty({ description: 'Role name', example: 'admin' })
  @Column({ name: 'role_name', unique: true })
  role_name: string;

  @ApiProperty({ description: 'Role description', example: 'Administrator role' })
  @Column({ nullable: true })
  description: string;

  // Relations
  @OneToMany(() => User, user => user.role)
  users: User[];
}
