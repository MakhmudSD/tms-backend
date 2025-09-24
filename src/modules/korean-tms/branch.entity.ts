import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'branches', schema: 'tms' })
export class Branch {
  @ApiProperty({ description: 'Branch ID', example: 1 })
  @PrimaryGeneratedColumn({ name: 'branch_id' })
  branch_id: number;

  @ApiProperty({ description: 'Branch name', example: '서울지점' })
  @Column({ name: 'branch_name' })
  branch_name: string;

  @ApiProperty({ description: 'Branch address', example: '서울특별시 강남구 테헤란로 123' })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ description: 'Phone number', example: '02-1234-5678' })
  @Column({ name: 'phone_number', nullable: true })
  phone_number: string;

  @ApiProperty({ description: 'Manager name', example: '김지점장' })
  @Column({ name: 'manager_name', nullable: true })
  manager_name: string;

  @ApiProperty({ description: 'Status', example: 'ACTIVE' })
  @Column({ default: 'ACTIVE' })
  status: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
